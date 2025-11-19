import { prisma } from './prisma'
import { User } from './types'

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  return user
}

export async function getUserByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  })

  return user
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
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

export async function followUser(followerId: string, followingId: string) {
  await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  })
}

export async function unfollowUser(followerId: string, followingId: string) {
  await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  })
}

export async function isFollowing(followerId: string, followingId: string) {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  })

  return !!follow
}

export async function getFollowerCount(userId: string) {
  const count = await prisma.follow.count({
    where: { followingId: userId },
  })

  return count
}

export async function getFollowingCount(userId: string) {
  const count = await prisma.follow.count({
    where: { followerId: userId },
  })

  return count
}
