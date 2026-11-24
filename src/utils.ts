import type { User } from './api'

export function filterUsersByName(users: User[], query: string): User[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return users

  return users.filter((user) =>
    user.name.toLowerCase().includes(normalizedQuery),
  )
}
