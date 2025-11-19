import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only key
)

export async function POST(req: NextRequest) {
  const { title, slug, excerpt, content, tags, } = await req.json()

  const { data, error } = await supabase
    .from('posts')
    .insert([{ title, slug, excerpt, content, tags, }])

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}


// GET — fetch all posts or a single one by slug
export async function GET(req: NextRequest) {
 

  try {
 const { searchParams } = new URL(req.url)
  const slug = searchParams.get("slug")
    


  const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}