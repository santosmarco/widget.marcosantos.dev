export const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

export const stringFormatter = {
  capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
}
