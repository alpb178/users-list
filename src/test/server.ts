import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { API_BASE_URL, type NewPost, type Post, type User } from '../api'

export const users: User[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'Shanna@melissa.tv',
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    username: 'Samantha',
    email: 'Nathan@yesenia.net',
  },
]

export const posts: Post[] = [
  {
    id: 1,
    userId: 1,
    title: 'sunt aut facere repellat',
    body: 'quia et suscipit suscipit recusandae',
  },
  {
    id: 2,
    userId: 1,
    title: 'qui est esse',
    body: 'est rerum tempore vitae sequi sint',
  },
]

const handlers = [
  http.get(`${API_BASE_URL}/users`, () => HttpResponse.json(users)),
  http.get(`${API_BASE_URL}/posts`, ({ request }) => {
    const userId = Number(new URL(request.url).searchParams.get('userId'))
    return HttpResponse.json(posts.filter((post) => post.userId === userId))
  }),
  http.post(`${API_BASE_URL}/posts`, async ({ request }) => {
    const newPost = (await request.json()) as NewPost
    return HttpResponse.json({ ...newPost, id: 101 }, { status: 201 })
  }),
]

export const server = setupServer(...handlers)
