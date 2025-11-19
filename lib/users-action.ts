
import { prisma } from './prisma'
import { User } from './types'

export async function updateUserProfileAction(userId: string, updates: Partial<User>) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      fullName: updates.full_name,
      avatarUrl: updates.avatar_url,
      bio: updates.bio,
    },
  })

  return user
}

export async function followUserAction(followerId: string, followingId: string) {
  await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  })
}

export async function unfollowUserAction(followerId: string, followingId: string) {
  await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  })
}
