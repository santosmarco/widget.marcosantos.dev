import {
  DimmedText,
  MinMaxTemperature,
  Widget,
  WidgetHighlight,
} from '@/components'
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
import { IconSearch } from '@tabler/icons-react'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

const HomePage: NextPage = () => {
  const [now, setNow] = useState(dayjs())
  const [today, setToday] = useState(dayjs().startOf('day'))

  const nowInterval = useInterval(() => setNow(dayjs()), 1000)
  const todayInterval = useInterval(
    () => setToday(dayjs().startOf('day')),
    dayjs().endOf('day').diff(dayjs())
  )

  const [search, setSearch] = useState('')

  const weatherQuery = trpc.weather.getByCityName.useQuery(
    { city: 'Rio de Janeiro' },
    { refetchInterval: 1000 * 60 * 15 /* 15 minutes */ }
  )
  const quoteQuery = trpc.quotes.getRandom.useQuery(undefined, {
    refetchInterval: 1000 * 60 * 60 * 24 /* 24 hours */,
  })
  const eventsQuery = trpc.gcal.listEvents.useQuery(
    {
      timeMin: today.toDate(),
      timeMax: today.add(1, 'day').endOf('day').toDate(),
    },
    { refetchInterval: 1000 * 60 * 15 /* 15 minutes */ }
  )

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

  console.log({ eventsQuery })

  return (
    <>
      <Container className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <Text className={styles.colors.text.primary}>
            {now.format('dddd, D MMMM')}
          </Text>

          <DimmedText>{weatherQuery.data?.name}</DimmedText>
        </div>

        <Text
          variant="gradient"
          gradient={styles.gradients.primary}
          className="text-2xl font-bold"
        >
          Good {getTimeOfDay(now)}, Marco
        </Text>

        <Space h="xs" />

        <Paper shadow="xl">
          <form onSubmit={handleSearchSubmit}>
            <TextInput
              placeholder="Search Google"
              icon={<IconSearch size={14} />}
              rightSection={
                <Button
                  type="submit"
                  variant="gradient"
                  gradient={styles.gradients.primary}
                  className="mr-9"
                  onClick={handleSearchSubmit}
                  compact={true}
                >
                  Search
                </Button>
              }
              value={search}
              onChange={handleSearchChange}
            />
          </form>
        </Paper>

        <Space h="xl" />

        <Widget title={<>It&rsquo;s now</>}>
          <WidgetHighlight>{now.format('h:mm A')}</WidgetHighlight>
        </Widget>

        <Space h="md" />

        <Widget
          title={<>It&rsquo;s currently</>}
          loading={weatherQuery.isLoading}
        >
          {weatherQuery.data && (
            <>
              <div className="flex items-start justify-between">
                <WidgetHighlight>
                  {integerFormatter.format(weatherQuery.data.main.feels_like)}
                  °C
                </WidgetHighlight>

                <Image
                  src={`http://openweathermap.org/img/wn/${weatherQuery.data.weather[0].icon}@2x.png`}
                  alt={`Weather icon for ${weatherQuery.data.weather[0].description}`}
                  width={64}
                  height={64}
                  className="-mt-8 -mr-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <DimmedText>
                  {stringFormatter.capitalize(
                    weatherQuery.data.weather[0].description
                  )}
                </DimmedText>

                <div className="flex items-center gap-1">
                  <MinMaxTemperature
                    kind="min"
                    value={weatherQuery.data.main.temp_min}
                  />
                  <MinMaxTemperature
                    kind="max"
                    value={weatherQuery.data.main.temp_max}
                  />
                </div>
              </div>
            </>
          )}
        </Widget>

        <Space h="md" />

        <Widget title="Upcoming events" loading={eventsQuery.isLoading}>
          {eventsQuery.data &&
            (eventsQuery.data.length <= 0 ? (
              <WidgetHighlight size="lg">No events today</WidgetHighlight>
            ) : (
              <div className="flex flex-col mt-0.5">
                {eventsQuery.data.map(event => (
                  <div key={event.id}>
                    <Badge
                      variant="gradient"
                      gradient={
                        styles.gradients[
                          isToday(dayjs(event.start?.dateTime))
                            ? 'secondary'
                            : 'primary'
                        ]
                      }
                      size="xs"
                    >
                      {event.start?.dateTime &&
                      isToday(dayjs(event.start.dateTime))
                        ? 'Today'
                        : 'Tomorrow'}{' '}
                      •{' '}
                      {event.start?.dateTime
                        ? dayjs(event.start.dateTime).format('h:mm A')
                        : 'All day'}
                    </Badge>

                    <div className="flex justify-between gap-4">
                      <Text className={styles.colors.text.primary}>
                        {event.organizer?.email === 'marco.santos@g2i.co'
                          ? 'G2i Interview'
                          : event.summary}
                      </Text>

                      <Tooltip
                        label={
                          oneHourToEventStart(event.start?.dateTime)
                            ? 'Click to join meeting'
                            : 'Button will be enabled 1 hour before the event starts'
                        }
                        color="cyan"
                        position="top-end"
                        withArrow={true}
                      >
                        <div className="ml-auto">
                          <Button
                            variant="gradient"
                            gradient={styles.gradients.success}
                            onClick={() =>
                              event.location && window.open(event.location)
                            }
                            compact={true}
                            disabled={
                              !oneHourToEventStart(event.start?.dateTime)
                            }
                          >
                            Go
                          </Button>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </Widget>
      </Container>

      {quoteQuery.data && (
        <div className="absolute bottom-0 flex flex-col p-4 w-screen">
          <Text
            variant="gradient"
            gradient={styles.gradients.primary}
            className="text-sm text-center"
          >
            {quoteQuery.data[0].q}
          </Text>

          <Text
            variant="gradient"
            gradient={styles.gradients.secondary}
            className="text-xs text-right"
          >
            — <em>{quoteQuery.data[0].a}</em>
          </Text>
        </div>
      )}
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

export default HomePage
