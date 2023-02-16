import { Global } from '@mantine/core'

const regular =
  'https://use.typekit.net/af/39cc4b/00000000000000007735fa4e/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3'

const bold =
  'https://use.typekit.net/af/4a5f61/00000000000000007735fa47/30/l?subset_id=2&fvd=n7&v=3'

export function CustomFonts() {
  return (
    <Global
      styles={[
        {
          '@font-face': {
            fontFamily: 'Greycliff CF',
            src: `url('${regular}') format("woff2")`,
            fontWeight: 400,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Greycliff CF',
            src: `url('${bold}') format("woff2")`,
            fontWeight: 700,
            fontStyle: 'normal',
          },
        },
      ]}
    />
  )
}
