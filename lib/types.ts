export interface User {
  id: string
  email: string
  username: string
  full_name?: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  author_id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  cover_image_url?: string
  status: 'draft' | 'published'
  published_at?: string
  created_at: string
  updated_at: string
  author?: User
  tags?: Tag[]
  clap_count?: number
  comment_count?: number
}

export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
}

export interface Comment {
  id: string
  post_id: string
  author_id: string
  parent_comment_id?: string
  content: string
  created_at: string
  updated_at: string
  author?: User
  replies?: Comment[]
}

export interface Clap {
  id: string
  post_id: string
  user_id: string
  created_at: string
}
