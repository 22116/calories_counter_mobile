export interface Event {
  [key: string]: any
}

export interface EventHandler {
  supports(event: Event): boolean
  handle(event: Event): Promise<void>
}
