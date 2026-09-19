import cors from 'cors'
import express, { type ErrorRequestHandler, type Request, type Response } from 'express'
import { createHabit, deleteHabit, getHabits, toggleHabit, updateHabit } from './services/habitsApi.js'
import type { CreateHabitInput, Habit, UpdateHabitInput } from './types.js'

const app = express()
const port = Number(process.env.PORT || 3001)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request: Request, response: Response<{ ok: boolean }>) => {
  response.json({ ok: true })
})

app.get('/api/habits', async (_request: Request, response: Response<Habit[]>, next) => {
  try {
    response.json(await getHabits())
  } catch (error) {
    next(error)
  }
})

app.post('/api/habits', async (
  request: Request<Record<string, never>, Habit, CreateHabitInput>,
  response: Response<Habit>,
  next
) => {
  try {
    response.status(201).json(await createHabit(request.body))
  } catch (error) {
    next(error)
  }
})

app.patch('/api/habits/:id', async (
  request: Request<{ id: string }, Habit, UpdateHabitInput>,
  response: Response<Habit>,
  next
) => {
  try {
    response.json(await updateHabit(request.params.id, request.body))
  } catch (error) {
    next(error)
  }
})

app.patch('/api/habits/:id/toggle', async (
  request: Request<{ id: string }, Habit>,
  response: Response<Habit>,
  next
) => {
  try {
    response.json(await toggleHabit(request.params.id))
  } catch (error) {
    next(error)
  }
})

app.delete('/api/habits/:id', async (
  request: Request<{ id: string }>,
  response: Response<void>,
  next
) => {
  try {
    await deleteHabit(request.params.id)
    response.status(204).send()
  } catch (error) {
    next(error)
  }
})

const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  console.error(error)
  const message = error instanceof Error ? error.message : 'Error interno del servidor'
  response.status(500).json({ message })
}

app.use(errorHandler)

app.listen(port, () => {
  console.log(`API de hábitos escuchando en http://localhost:${port}`)
})