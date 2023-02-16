import {
  DimmedText,
  MinMaxTemperature,
  TodoCounter,
  Widget,
  WidgetHighlight,
} from '@/components'
import { Todo } from '@/server/routers/todos'
import { styles } from '@/styles'
import { integerFormatter, stringFormatter, trpc } from '@/utils'
import {
  Badge,
  Button,
  Container,
  Paper,
  Space,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { useInterval } from '@mantine/hooks'
import { IconCirclePlus, IconSearch } from '@tabler/icons-react'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
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

  const { delayed, pending, completed } = useMemo(() => {
    return (todosQuery?.data ?? []).reduce<{
      delayed: Todo[]
      pending: Todo[]
      completed: Todo[]
    }>(
      (acc, todo) => {
        if (todo.completed) {
          acc.completed.push(todo)
        } else if (todo.dueDate && dayjs(todo.dueDate).isBefore(now)) {
          acc.delayed.push(todo)
        } else {
          acc.pending.push(todo)
        }
        return acc
      },
      { delayed: [], pending: [], completed: [] }
    )
  }, [todosQuery?.data, now])

  const handleSearchChange = useCallback(
    (ev: { target: { value: string } }) => {
      setSearch(ev.target.value)
    },
    []
  )

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
            <div className="flex items-center gap-2">
              <TodoCounter
                count={delayed.length}
                label="delayed"
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
