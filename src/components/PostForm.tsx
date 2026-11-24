import { useRef, useState } from 'react'
import type { Post } from '../api'
import { useCreatePost } from '../hooks'
import {
  validatePostDraft,
  type PostDraft,
  type PostDraftErrors,
} from '../utils'
import { ErrorMessage, StatusMessage } from './ui/display'
import { Button, TextAreaField, TextField } from './ui/form'

const EMPTY_DRAFT: PostDraft = { title: '', body: '' }

interface PostFormProps {
  userId: number
  onCreated: (post: Post) => void
}

export function PostForm({ userId, onCreated }: PostFormProps) {
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [errors, setErrors] = useState<PostDraftErrors>({})
  const titleRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const createPost = useCreatePost(onCreated)

  function updateField(field: keyof PostDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    if (createPost.isSuccess || createPost.isError) createPost.reset()
  }

  function submit() {
    const validationErrors = validatePostDraft(draft)
    setErrors(validationErrors)
    if (validationErrors.title) {
      titleRef.current?.focus()
      return
    }
    if (validationErrors.body) {
      bodyRef.current?.focus()
      return
    }

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
        ref={titleRef}
        label="Título"
        value={draft.title}
        error={errors.title}
        onChange={(event) => {
          updateField('title', event.target.value)
        }}
      />
      <TextAreaField
        ref={bodyRef}
        label="Texto"
        value={draft.body}
        error={errors.body}
        onChange={(event) => {
          updateField('body', event.target.value)
        }}
      />
      {createPost.isError && (
        <ErrorMessage message="No se pudo publicar. Inténtalo de nuevo." />
      )}
      <div className="flex items-center justify-end gap-3">
        {createPost.isSuccess && (
          <StatusMessage>Publicación creada.</StatusMessage>
        )}
        <Button type="submit" disabled={createPost.isPending}>
          {createPost.isPending ? 'Publicando…' : 'Publicar'}
        </Button>
      </div>
    </form>
  )
}
