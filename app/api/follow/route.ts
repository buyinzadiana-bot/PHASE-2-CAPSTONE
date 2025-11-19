import { NextResponse } from 'next/server'
import { followUser } from '../.../../../../lib/users'

export async function POST(req: Request) {
  const { followerId, followingId } = await req.json()
  await followUser(followerId, followingId)
  return NextResponse.json({ success: true })
}
