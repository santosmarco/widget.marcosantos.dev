import dayjs from 'dayjs'
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
        text: 'Todo 1Todo 1Todo 1Todo 1Todo 1Todo 1Todo 1Todo 1Todo 1Todo 1Todo 1Todo 1Todo 1Todo 1Todo 1Todo 1Todo 1Todo 1Todo 1',
        completed: false,
        dueDate: dayjs().add(1, 'day').toDate(),
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

  setCompleteness: publicProcedure
    .input(
      z.object({
        id: z.string(),
        completed: z.boolean(),
      })
    )
    .mutation(async ({ input: { id, completed } }) => {
      console.log(id, completed)
    }),
})
