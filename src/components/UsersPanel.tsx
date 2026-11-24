import { useState } from 'react'
import type { User } from '../api'
import { useUsers } from '../hooks'
import { filterUsersByName } from '../utils'
import { Card, ErrorMessage, StatusMessage } from './ui/display'
import { TextField } from './ui/form'

interface UsersPanelProps {
  selectedUserId: number | null
  onSelect: (user: User) => void
}

export function UsersPanel({ selectedUserId, onSelect }: UsersPanelProps) {
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
        <UserList
          users={filterUsersByName(users, query)}
          query={query}
          selectedUserId={selectedUserId}
          onSelect={onSelect}
        />
      )}
    </Card>
  )
}

interface UserListProps extends UsersPanelProps {
  users: User[]
  query: string
}

function UserList({ users, query, selectedUserId, onSelect }: UserListProps) {
  if (users.length === 0) {
    return (
      <StatusMessage>
        No hay usuarios que coincidan con «{query.trim()}».
      </StatusMessage>
    )
  }

  return (
    <ul className="-m-1 flex max-h-72 flex-col gap-1 overflow-y-auto p-1 md:max-h-[calc(100vh-16rem)]">
      {users.map((user) => (
        <li key={user.id}>
          <button
            type="button"
            aria-pressed={user.id === selectedUserId}
            onClick={() => {
              onSelect(user)
            }}
            className="w-full rounded-lg px-3 py-2 text-left transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none aria-pressed:bg-indigo-50 aria-pressed:ring-1 aria-pressed:ring-indigo-500"
          >
            <span className="block font-medium">{user.name}</span>
            <span className="block text-sm break-words text-slate-600">
              {user.username} · {user.email}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
