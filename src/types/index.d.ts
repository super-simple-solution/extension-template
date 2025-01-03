export {}

declare global {
  type DemoType = {
    [key: string]: () => any
  }
}
