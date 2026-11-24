import { useState } from 'react'
import type { Post } from '../api'
import { useCreatePost } from '../hooks'
import {
  validatePostDraft,
  type PostDraft,
  type PostDraftErrors,
} from '../utils'
import { Button, TextAreaField, TextField } from './ui/form'

const EMPTY_DRAFT: PostDraft = { title: '', body: '' }

interface PostFormProps {
  userId: number
  onCreated: (post: Post) => void
}

export function PostForm({ userId, onCreated }: PostFormProps) {
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [errors, setErrors] = useState<PostDraftErrors>({})
  const createPost = useCreatePost(onCreated)

  function updateField(field: keyof PostDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function submit() {
    const validationErrors = validatePostDraft(draft)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    createPost.mutate(
      { userId, title: draft.title.trim(), body: draft.body.trim() },
      {
        onSuccess: () => {
          setDraft(EMPTY_DRAFT)
        },
      },
    )
  }

  return (
    <form
      aria-label="Nueva publicación"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
      className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4"
    >
      <TextField
        label="Título"
        value={draft.title}
        error={errors.title}
        onChange={(event) => {
          updateField('title', event.target.value)
        }}
      />
      <TextAreaField
        label="Texto"
        value={draft.body}
        error={errors.body}
        onChange={(event) => {
          updateField('body', event.target.value)
        }}
      />
      <Button type="submit" className="self-end">
        Publicar
      </Button>
    </form>
  )
}
