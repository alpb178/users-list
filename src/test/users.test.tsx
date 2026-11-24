import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, test } from 'vitest'
import { API_BASE_URL } from '../api'
import { renderApp } from './render'
import { server, users } from './server'

describe('users list', () => {
  test('shows a loading state and then every user', async () => {
    renderApp()

    expect(screen.getByRole('status')).toHaveTextContent('Cargando usuarios…')
    for (const { name } of users) {
      expect(await screen.findByText(name)).toBeInTheDocument()
    }
  })

  test('shows an error and recovers on retry', async () => {
    server.use(
      http.get(
        `${API_BASE_URL}/users`,
        () => HttpResponse.json(null, { status: 500 }),
        { once: true },
      ),
    )
    const { user } = renderApp()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudieron cargar los usuarios.',
    )
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
