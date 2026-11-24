import type { User } from './api'

export function filterUsersByName(users: User[], query: string): User[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return users

  return users.filter((user) =>
    user.name.toLowerCase().includes(normalizedQuery),
  )
}

export interface PostDraft {
  title: string
  body: string
}

export type PostDraftErrors = Partial<Record<keyof PostDraft, string>>

export function validatePostDraft(draft: PostDraft): PostDraftErrors {
  const errors: PostDraftErrors = {}
  if (!draft.title.trim()) errors.title = 'El título es obligatorio'
  if (!draft.body.trim()) errors.body = 'El texto es obligatorio'
  return errors
}
