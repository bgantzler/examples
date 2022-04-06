import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../src/LoginForm'
import { server } from '../src/mocks/server'
import { rest } from 'msw'

it('allows user to log in (order segment last)', async () => {

  server.use(
    rest.post('/login', (req, res, ctx) => {
      const { username } = req.body

      return res(
          ctx.json({
            id: 'f79e82e8-c34a-4dc7-a49e-9fadc0979fda',
            username,
            firstName: 'John',
            lastName: 'Maverick',
          }),
      )
    })
  );
  server.use(
      rest.post('/:id', (req, res, ctx) => {
        const { username } = req.body

        return res(
            ctx.json({
              id: 'f79e82e8-c34a-4dc7-a49e-9fadc0979fda',
              username,
              firstName: 'John',
              lastName: 'Doe',
            }),
        )
      }),
  );

  render(<LoginForm />)

  await userEvent.type(screen.getByLabelText(/username/i), 'johnUser')
  userEvent.click(screen.getByRole('button', { name: /submit/i }))

  expect(
    await screen.findByText('f79e82e8-c34a-4dc7-a49e-9fadc0979fda'),
  ).toBeVisible()
  expect(await screen.findByText('John')).toBeVisible()
  expect(await screen.findByText('Maverick')).toBeVisible()
})

it('allows user to log in (order segment first)', async () => {
  server.use(
      rest.post('/:id', (req, res, ctx) => {
        const { username } = req.body

        return res(
            ctx.json({
              id: 'f79e82e8-c34a-4dc7-a49e-9fadc0979fda',
              username,
              firstName: 'John',
              lastName: 'Doe',
            }),
        )
      }),
  );

  server.use(
      rest.post('/login', (req, res, ctx) => {
        const { username } = req.body

        return res(
            ctx.json({
              id: 'f79e82e8-c34a-4dc7-a49e-9fadc0979fda',
              username,
              firstName: 'John',
              lastName: 'Maverick',
            }),
        )
      })
  );

  render(<LoginForm />)

  await userEvent.type(screen.getByLabelText(/username/i), 'johnUser')
  userEvent.click(screen.getByRole('button', { name: /submit/i }))

  expect(
      await screen.findByText('f79e82e8-c34a-4dc7-a49e-9fadc0979fda'),
  ).toBeVisible()
  expect(await screen.findByText('John')).toBeVisible()
  expect(await screen.findByText('Maverick')).toBeVisible()
})
