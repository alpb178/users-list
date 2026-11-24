import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, test } from 'vitest'
import { API_BASE_URL } from '../api'
import { renderApp, renderAppAndSelectUser } from './render'
import { posts, server } from './server'

const userButton = (name: string) =>
  screen.getByRole('button', { name: new RegExp(name) })

describe('user posts', () => {
  test('asks to choose a user before any is selected', async () => {
    renderApp()

    expect(
      await screen.findByText('Elige un usuario para ver sus publicaciones.'),
    ).toBeInTheDocument()
  })

  test('shows the posts of the selected user', async () => {
    await renderAppAndSelectUser('Leanne Graham')

    expect(userButton('Leanne Graham')).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('heading', { name: 'Publicaciones de Leanne Graham' }),
    ).toBeInTheDocument()
    for (const { title } of posts) {
      expect(
        await screen.findByRole('heading', { level: 3, name: title }),
      ).toBeInTheDocument()
    }
  })

  test('explains when the user has no posts', async () => {
    await renderAppAndSelectUser('Ervin Howell')

    expect(
      await screen.findByText('Este usuario no tiene publicaciones.'),
    ).toBeInTheDocument()
  })

  test('shows an error without hiding the users and recovers on retry', async () => {
    server.use(
      http.get(
        `${API_BASE_URL}/posts`,
        () => HttpResponse.json(null, { status: 500 }),
        { once: true },
      ),
    )
    const { user } = await renderAppAndSelectUser('Leanne Graham')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudieron cargar las publicaciones.',
    )
    expect(userButton('Ervin Howell')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(
      await screen.findByRole('heading', { level: 3, name: posts[0]?.title }),
    ).toBeInTheDocument()
  })
})
