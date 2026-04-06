import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json(
      { success: false, data: null, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return NextResponse.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      profile,
    },
    error: null,
  })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { action } = await req.json()

  if (action === 'logout') {
    const { error } = await supabase.auth.signOut()
    if (error) {
      return NextResponse.json(
        { success: false, data: null, error: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json({ success: true, data: null, error: null })
  }

  return NextResponse.json(
    { success: false, data: null, error: 'Unknown action' },
    { status: 400 }
  )
}
