import type { Post, User } from '../api'
import { usePosts } from '../hooks'
import { PostForm } from './PostForm'
import { Card, ErrorMessage, StatusMessage } from './ui/display'

interface PostsPanelProps {
  user: User | null
  createdPosts: Post[]
  onCreated: (post: Post) => void
}

export function PostsPanel({ user, createdPosts, onCreated }: PostsPanelProps) {
  if (!user) {
    return (
      <Card title="Publicaciones">
        <p className="text-sm text-slate-600">
          Elige un usuario para ver sus publicaciones.
        </p>
      </Card>
    )
  }

  return (
    <Card title={`Publicaciones de ${user.name}`}>
      <PostForm key={user.id} userId={user.id} onCreated={onCreated} />
      <UserPosts userId={user.id} createdPosts={createdPosts} />
    </Card>
  )
}

function UserPosts({
  userId,
  createdPosts,
}: {
  userId: number
  createdPosts: Post[]
}) {
  const { data, isPending, isError, refetch } = usePosts(userId)

  if (isPending) {
    return <StatusMessage>Cargando publicaciones…</StatusMessage>
  }
  if (isError) {
    return (
      <ErrorMessage
        message="No se pudieron cargar las publicaciones."
        onRetry={() => void refetch()}
      />
    )
  }

  const posts = [...createdPosts, ...data]
  if (posts.length === 0) {
    return <StatusMessage>Este usuario no tiene publicaciones.</StatusMessage>
  }

  return (
    <ul className="flex flex-col gap-3">
      {posts.map((post) => (
        <li key={post.id}>
          <article className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold break-words first-letter:uppercase">
              {post.title}
            </h3>
            <p className="mt-1 text-sm break-words whitespace-pre-line text-slate-600">
              {post.body}
            </p>
          </article>
        </li>
      ))}
    </ul>
  )
}
