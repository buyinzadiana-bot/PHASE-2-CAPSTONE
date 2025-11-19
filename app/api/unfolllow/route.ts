import { NextResponse } from 'next/server'
import { unfollowUser } from '../.../../../../lib/users'

export async function POST(req: Request) {
  const { followerId, followingId } = await req.json()
  await unfollowUser(followerId, followingId)
  return NextResponse.json({ success: true })
}
