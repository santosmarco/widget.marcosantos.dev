import { nanoid } from 'nanoid'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const TodoSchema = z.object({
  id: z.string().default(() => nanoid()),
  text: z.string().min(1, 'Required'),
  completed: z.boolean().default(false),
  dueDate: z.date().optional(),
})

export type Todo = z.infer<typeof TodoSchema>

export const todosRouter = router({
  getAll: publicProcedure.output(z.array(TodoSchema)).query(async () => {
    return [
      {
        id: '1',
        text: 'Todo 1',
        completed: false,
      },
      {
        id: '2',
        text: 'Todo 2',
        completed: true,
      },
      {
        id: '3',
        text: 'Todo 3',
        completed: false,
      },
    ]
  }),

  getPending: publicProcedure.output(z.array(TodoSchema)).query(async () => {
    return [
      {
        id: '1',
        text: 'Todo 1',
        completed: false,
      },
      {
        id: '2',
        text: 'Todo 2',
        completed: false,
      },
      {
        id: '3',
        text: 'Todo 3',
        completed: false,
      },
    ]
  }),
})
