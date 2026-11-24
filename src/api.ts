export const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

export interface User {
  id: number
  name: string
  username: string
  email: string
}

export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

export type NewPost = Omit<Post, 'id'>

class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, init)
  } catch {
    throw new ApiError(0, 'Network error')
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Request to ${path} failed with status ${String(response.status)}`,
    )
  }

  return response.json() as Promise<T>
}

export const getUsers = () => request<User[]>('/users')

export const getPostsByUser = (userId: number) =>
  request<Post[]>(`/posts?userId=${String(userId)}`)

export const createPost = (post: NewPost) =>
  request<Post>('/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(post),
  })
