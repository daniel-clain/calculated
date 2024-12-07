export type WorldEvent = {
  name: string
  activationTime: number
  executeEvent: () => void
}
