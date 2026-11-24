import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, test, vi } from 'vitest'
import { API_BASE_URL } from '../api'
import { renderAppAndSelectUser } from './render'
import { posts, server } from './server'

const titleField = () => screen.getByRole('textbox', { name: 'Título' })
const bodyField = () => screen.getByRole('textbox', { name: 'Texto' })
const submitButton = () => screen.getByRole('button', { name: 'Publicar' })

describe('create post', () => {
  test('blocks an empty post and explains each required field', async () => {
    const onPost = vi.fn()
    server.use(
      http.post(`${API_BASE_URL}/posts`, () => {
        onPost()
        return HttpResponse.json({}, { status: 201 })
      }),
    )
    const { user } = await renderAppAndSelectUser('Leanne Graham')

    await user.type(titleField(), '   ')
    await user.click(submitButton())

    expect(screen.getByText('El título es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('El texto es obligatorio')).toBeInTheDocument()
    expect(titleField()).toHaveAttribute('aria-invalid', 'true')
    expect(onPost).not.toHaveBeenCalled()
  })

  test('adds the new post at the top of the list and clears the form', async () => {
    const { user } = await renderAppAndSelectUser('Leanne Graham')
    await screen.findByRole('heading', { level: 3, name: posts[0]?.title })

    await user.type(titleField(), 'Mi primera publicación')
    await user.type(bodyField(), 'Hola mundo')
    await user.click(submitButton())

    await waitFor(() => {
      expect(screen.getAllByRole('heading', { level: 3 })[0]).toHaveTextContent(
        'Mi primera publicación',
      )
    })
    expect(titleField()).toHaveValue('')
    expect(bodyField()).toHaveValue('')
  })
})
