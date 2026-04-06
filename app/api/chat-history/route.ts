import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const saveChatSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().max(200).optional(),
  messages: z.array(z.record(z.unknown())),
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
    .from('chat_history')
    .select('id, title, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

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
  const parsed = saveChatSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, data: null, error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { id, title, messages } = parsed.data

  if (id) {
    // Update existing chat
    const { data, error } = await supabase
      .from('chat_history')
      .update({ messages, title })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, data: null, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data, error: null })
  }

  // Create new chat
  const { data, error } = await supabase
    .from('chat_history')
    .insert({
      user_id: user.id,
      messages,
      title: title || 'Untitled Chat',
    })
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

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { success: false, data: null, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { success: false, data: null, error: 'Missing chat id' },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from('chat_history')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json(
      { success: false, data: null, error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, data: null, error: null })
}
