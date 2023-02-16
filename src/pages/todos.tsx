import { TodoCounter } from '@/components'
import { Todo } from '@/server/routers/todos'
import { styles } from '@/styles'
import { trpc } from '@/utils'
import {
  ActionIcon,
  Button,
  Checkbox,
  Container,
  Paper,
  Space,
  Text,
  Tooltip,
} from '@mantine/core'
import { useInterval } from '@mantine/hooks'
import {
  IconCirclePlus,
  IconClock,
  IconPencil,
  IconSettings,
  IconTrash,
} from '@tabler/icons-react'
import cn from 'classnames'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import { useCallback, useEffect, useMemo, useState } from 'react'

const NotesPage: NextPage = () => {
  const [now, setNow] = useState(dayjs())
  const [today, setToday] = useState(dayjs().startOf('day'))

  const nowInterval = useInterval(() => setNow(dayjs()), 1000)
  const todayInterval = useInterval(
    () => setToday(dayjs().startOf('day')),
    dayjs().endOf('day').diff(dayjs())
  )

  const [search, setSearch] = useState('')

  const todosQuery = trpc.todos.getAll.useQuery()
  const todosSetCompletenessMutation = trpc.todos.setCompleteness.useMutation()

  const {
    overdue: overdue,
    pending,
    completed,
  } = useMemo(() => {
    return (todosQuery?.data ?? []).reduce<{
      overdue: Todo[]
      pending: Todo[]
      completed: Todo[]
    }>(
      (acc, todo) => {
        if (todo.completed) {
          acc.completed.push(todo)
        } else if (todo.dueDate && dayjs(todo.dueDate).isBefore(now)) {
          acc.overdue.push(todo)
        } else {
          acc.pending.push(todo)
        }
        return acc
      },
      { overdue: [], pending: [], completed: [] }
    )
  }, [todosQuery?.data, now])

  const handleSetCompleteness = useCallback((id: string) => {
    return (ev: { currentTarget: { checked: boolean } }) => {
      todosSetCompletenessMutation.mutateAsync({
        id,
        completed: ev.currentTarget.checked,
      })
    }
  }, [])

  const handleSearchSubmit = useCallback(
    (ev: { preventDefault?: () => void }) => {
      ev.preventDefault?.()
      window.open(`https://google.com/search?q=${search}`)
    },
    [search]
  )

  useEffect(() => {
    nowInterval.start()
    return nowInterval.stop
  }, [nowInterval])

  useEffect(() => {
    todayInterval.start()
    return todayInterval.stop
  }, [todayInterval])

  return (
    <>
      <Container className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <Text className={styles.colors.text.primary}>Your todos</Text>

          <Button
            type="submit"
            variant="gradient"
            gradient={styles.gradients.primary}
            leftIcon={<IconCirclePlus size={14} className="-mr-1.5" />}
            compact={true}
          >
            Add todo
          </Button>
        </div>

        {todosQuery.data && (
          <>
            <div className="flex items-center gap-2 h-8">
              <TodoCounter
                count={overdue.length}
                label="overdue"
                gradient={styles.gradients.danger}
              />
              <TodoCounter
                count={pending.length}
                label="pending"
                gradient={styles.gradients.primary}
              />
              <TodoCounter
                count={completed.length}
                label="completed"
                gradient={styles.gradients.success}
              />
            </div>

            <Space h="xs" />

            {todosQuery.data
              .sort((a, b) => {
                if (a.completed && !b.completed) {
                  return 1
                } else if (!a.completed && b.completed) {
                  return -1
                } else if (a.dueDate && !b.dueDate) {
                  return -1
                } else if (!a.dueDate && b.dueDate) {
                  return 1
                } else if (a.dueDate && b.dueDate) {
                  return dayjs(a.dueDate).diff(dayjs(b.dueDate))
                } else {
                  return 0
                }
              })
              .map(todo => (
                <Paper
                  key={todo.id}
                  shadow="lg"
                  className="flex items-start justify-between gap-4 p-4 mb-2"
                  withBorder={true}
                >
                  <Checkbox
                    label={
                      <>
                        <div
                          className={cn(
                            styles.colors.text.primary,
                            todo.completed && 'line-through'
                          )}
                        >
                          {todo.text}
                        </div>

                        {todo.dueDate && (
                          <strong
                            className={cn(
                              'flex items-center gap-1 mt-1',
                              dayjs(todo.dueDate).diff(dayjs(), 'day') <= 0 &&
                                'text-red-500'
                            )}
                          >
                            <IconClock size={12} /> Due{' '}
                            {dayjs(todo.dueDate).fromNow()}
                          </strong>
                        )}
                      </>
                    }
                    checked={todo.completed}
                    onChange={handleSetCompleteness(todo.id)}
                    color={todo.completed ? 'green' : 'cyan'}
                    size="xs"
                    radius="xl"
                  />

                  <ActionIcon variant="subtle" className="-mt-1.5 -mr-1.5">
                    <IconPencil size={16} />
                  </ActionIcon>
                </Paper>
              ))}
          </>
        )}
      </Container>
    </>
  )
}

function getTimeOfDay(date: dayjs.Dayjs) {
  const hour = date.hour()

  if (hour < 12) {
    return 'morning'
  } else if (hour < 18) {
    return 'afternoon'
  } else {
    return 'evening'
  }
}

function isToday(date: dayjs.Dayjs) {
  return date.isSame(dayjs(), 'day')
}

function oneHourToEventStart(startDate: string | null | undefined) {
  if (!startDate) {
    return false
  }

  return dayjs(startDate).diff(dayjs(), 'hour') <= 1
}

export default NotesPage
