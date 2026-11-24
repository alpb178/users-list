import { useUsers } from '../hooks'
import { Card, ErrorMessage, StatusMessage } from './ui'

export function UsersPanel() {
  const { data: users, isPending, isError, refetch } = useUsers()

  return (
    <Card title="Usuarios">
      {isPending ? (
        <StatusMessage>Cargando usuarios…</StatusMessage>
      ) : isError ? (
        <ErrorMessage
          message="No se pudieron cargar los usuarios."
          onRetry={() => void refetch()}
        />
      ) : (
        <ul className="flex flex-col gap-1">
          {users.map((user) => (
            <li key={user.id} className="rounded-lg px-3 py-2">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm break-words text-slate-600">
                {user.username} · {user.email}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
