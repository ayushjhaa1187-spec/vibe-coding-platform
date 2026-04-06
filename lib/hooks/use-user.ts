'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  user_id: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  github_url: string | null
  skill_level: string | null
}

interface UserState {
  user: User | null
  profile: Profile | null
  loading: boolean
}

export function useUser() {
  const [state, setState] = useState<UserState>({
    user: null,
    profile: null,
    loading: true,
  })

  useEffect(() => {
    const supabase = createClient()

    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setState({ user: null, profile: null, loading: false })
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setState({ user, profile, loading: false })
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          getUser()
        } else {
          setState({ user: null, profile: null, loading: false })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return { ...state, logout }
}
