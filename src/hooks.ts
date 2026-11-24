import { skipToken, useQuery } from '@tanstack/react-query'
import { getPostsByUser, getUsers } from './api'

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: getUsers })
}

export function usePosts(userId: number | null) {
  return useQuery({
    queryKey: ['posts', userId],
    queryFn: userId === null ? skipToken : () => getPostsByUser(userId),
  })
}
