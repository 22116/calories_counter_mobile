export enum CounterType {
  Limited,
  Binary
}

export interface Counter {
  name: string,
  description: string,
  type: CounterType,
  icon: string | null,
  createdAt: string | null,
  [key: string]: unknown
}

export interface BinaryCounter extends Counter {
  type: CounterType.Binary,
  value: boolean
}

export interface LimitedCounter extends Counter {
  type: CounterType.Limited,
  limit: number,
  current: number
}
