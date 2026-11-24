import { skipToken, useMutation, useQuery } from '@tanstack/react-query'
import { useCallback, useRef, useState } from 'react'
import { createPost, getPostsByUser, getUsers, type Post } from './api'

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: getUsers })
}

export function usePosts(userId: number | null) {
  return useQuery({
    queryKey: ['posts', userId],
    queryFn: userId === null ? skipToken : () => getPostsByUser(userId),
  })
}

/**
 * The success callback lives in the hook options, not in `mutate`, so it
 * still runs if the form unmounts (e.g. the user switches) mid-request.
 */
export function useCreatePost(onCreated: (post: Post) => void) {
  return useMutation({
    mutationFn: createPost,
    onSuccess: (post, newPost) => {
      onCreated({ ...post, userId: newPost.userId })
    },
  })
}

const NO_POSTS: Post[] = []

/**
 * JSONPlaceholder does not persist created posts and always answers id 101,
 * so they are kept here per user with unique negative ids that can never
 * collide with server ids.
 */
export function useCreatedPosts() {
  const [postsByUser, setPostsByUser] = useState<Record<number, Post[]>>({})
  const lastLocalId = useRef(0)

  const add = useCallback((post: Post) => {
    lastLocalId.current -= 1
    const localPost = { ...post, id: lastLocalId.current }
    setPostsByUser((current) => ({
      ...current,
      [post.userId]: [localPost, ...(current[post.userId] ?? [])],
    }))
  }, [])

  const postsFor = useCallback(
    (userId: number) => postsByUser[userId] ?? NO_POSTS,
    [postsByUser],
  )

  return { add, postsFor }
}
