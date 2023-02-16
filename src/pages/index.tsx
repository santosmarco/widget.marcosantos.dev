import { Widget } from '@/components'
import { styles } from '@/styles'
import { integerFormatter, stringFormatter, trpc } from '@/utils'
import { Button, Container, Paper, Space, Text, TextInput } from '@mantine/core'
import { useInterval } from '@mantine/hooks'
import { IconArrowDown, IconArrowUp, IconSearch } from '@tabler/icons-react'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

const HomePage: NextPage = () => {
  const [now, setNow] = useState(dayjs())
  const nowInterval = useInterval(() => setNow(dayjs()), 1000)

  const [search, setSearch] = useState('')

  const weatherQuery = trpc.weather.getByCityName.useQuery(
    { city: 'Rio de Janeiro' },
    { refetchInterval: 1000 * 60 * 15 /* 15 minutes */ }
  )

  const quoteQuery = trpc.quotes.getRandom.useQuery(undefined, {
    refetchInterval: 1000 * 60 * 60 * 24 /* 24 hours */,
  })

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

  return (
    <>
      <Container className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <Text className={styles.colors.text.primary}>
            {now.format('dddd, D MMMM')}
          </Text>

          <Text color="dimmed">{weatherQuery.data?.name}</Text>
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

        <Widget>
          <Text className={styles.colors.text.primary}>
            It&rsquo;s now
            <br />
            <Text
              variant="gradient"
              gradient={styles.gradients.secondary}
              className="text-3xl font-bold"
            >
              {now.format('h:mm A')}
            </Text>
          </Text>
        </Widget>

        <Space h="md" />

        <Widget loading={weatherQuery.isLoading}>
          {weatherQuery.data && (
            <>
              <div className="flex items-start justify-between">
                <Text className={styles.colors.text.primary}>
                  <div>It&rsquo;s currently</div>

                  <div className="flex items-end gap-2">
                    <Text
                      variant="gradient"
                      gradient={styles.gradients.secondary}
                      className="text-3xl font-bold"
                    >
                      {integerFormatter.format(
                        weatherQuery.data.main.feels_like
                      )}
                      °C
                    </Text>
                  </div>
                </Text>

                <Image
                  src={`http://openweathermap.org/img/wn/${weatherQuery.data.weather[0].icon}@2x.png`}
                  alt={`Weather icon for ${weatherQuery.data.weather[0].description}`}
                  width={64}
                  height={64}
                  className="-mr-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <Text color="dimmed">
                  {stringFormatter.capitalize(
                    weatherQuery.data.weather[0].description
                  )}
                </Text>

                <div className="flex items-center gap-1">
                  <Text
                    color="cyan"
                    className="flex items-center gap-0.5 font-bold"
                  >
                    <IconArrowDown
                      size={16}
                      stroke={3}
                      className="text-cyan-500"
                    />
                    <span>
                      {integerFormatter.format(weatherQuery.data.main.temp_min)}
                    </span>
                  </Text>

                  <Text
                    color="orange"
                    className="flex items-center gap-0.5 font-bold"
                  >
                    <IconArrowUp
                      size={16}
                      stroke={3}
                      className="text-orange-500"
                    />
                    <span>
                      {integerFormatter.format(weatherQuery.data.main.temp_max)}
                    </span>
                  </Text>
                </div>
              </div>
            </>
          )}
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

const getTimeOfDay = (date: dayjs.Dayjs) => {
  const hour = date.hour()

  if (hour < 12) {
    return 'morning'
  } else if (hour < 18) {
    return 'afternoon'
  } else {
    return 'evening'
  }
}

export default HomePage
