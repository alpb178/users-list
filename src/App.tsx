import { useState } from 'react'
import type { User } from './api'
import { UsersPanel } from './components/UsersPanel'

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 md:p-8">
        <header>
          <h1 className="text-2xl font-bold md:text-3xl">
            Usuarios y publicaciones
          </h1>
        </header>
        <main className="grid items-start gap-6 md:grid-cols-3">
          <UsersPanel
            selectedUserId={selectedUser?.id ?? null}
            onSelect={setSelectedUser}
          />
        </main>
      </div>
    </div>
  )
}

export default App
