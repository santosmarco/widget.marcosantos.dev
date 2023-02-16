import type { MantineGradient } from '@mantine/core'

const gradients = {
  primary: {
    from: 'indigo',
    to: 'cyan',
    deg: 45,
  },

  secondary: {
    from: 'teal',
    to: 'blue',
    deg: 60,
  },

  danger: {
    from: 'orange',
    to: 'red',
  },
} as const satisfies Record<string, MantineGradient>

export const styles = {
  colors: {
    scheme: 'dark',

    text: {
      primary:
        'text-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-gray-900',
    },
  },

  fonts: {
    body: 'Greycliff CF, sans-serif',
  },

  gradients,
} as const
