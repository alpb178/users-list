import { useState } from 'react'
import type { User } from '../api'
import { useUsers } from '../hooks'
import { filterUsersByName } from '../utils'
import { Card, ErrorMessage, StatusMessage } from './ui/display'
import { TextField } from './ui/form'

export function UsersPanel() {
  const [query, setQuery] = useState('')
  const { data: users, isPending, isError, refetch } = useUsers()

  return (
    <Card title="Usuarios">
      <TextField
        type="search"
        label="Buscar por nombre"
        placeholder="Ej.: Leanne"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
        }}
      />
      {isPending ? (
        <StatusMessage>Cargando usuarios…</StatusMessage>
      ) : isError ? (
        <ErrorMessage
          message="No se pudieron cargar los usuarios."
          onRetry={() => void refetch()}
        />
      ) : (
        <UserList users={filterUsersByName(users, query)} query={query} />
      )}
    </Card>
  )
}

function UserList({ users, query }: { users: User[]; query: string }) {
  if (users.length === 0) {
    return (
      <StatusMessage>
        No hay usuarios que coincidan con «{query.trim()}».
      </StatusMessage>
    )
  }

  return (
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
  )
}
