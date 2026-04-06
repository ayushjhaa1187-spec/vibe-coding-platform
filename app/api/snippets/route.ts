import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const createSnippetSchema = z.object({
  title: z.string().min(1).max(200),
  code: z.string().min(1),
  language: z.string().max(50).optional(),
  description: z.string().max(2000).optional(),
  project_id: z.string().uuid().optional(),
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { success: false, data: null, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  const { data, error } = await supabase
    .from('snippets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

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
  const parsed = createSnippetSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, data: null, error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('snippets')
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
