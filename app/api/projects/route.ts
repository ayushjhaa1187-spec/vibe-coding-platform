import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  language: z.string().max(50).optional(),
  code_content: z.string().optional(),
  is_public: z.boolean().default(true),
})

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { success: false, data: null, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(req.url)
  const publicOnly = searchParams.get('public') === 'true'

  let query = supabase.from('projects').select('*')

  if (publicOnly) {
    query = query.eq('is_public', true)
  } else {
    query = query.eq('user_id', user.id)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json(
      { success: false, data: null, error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, data, error: null })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { success: false, data: null, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  const body = await req.json()
  const parsed = createProjectSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, data: null, error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { success: false, data: null, error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, data, error: null }, { status: 201 })
}
