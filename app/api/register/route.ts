import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only key
)

export async function POST(req: NextRequest) {
  const { id, email, username, full_name } = await req.json()

  const { data, error } = await supabase
    .from('users')
    .insert([{ id, email, username, full_name }])

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
