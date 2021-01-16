export enum CounterType {
  Limited,
  Binary,
  Goal
}

export interface Counter {
  name: string,
  description: string,
  type: CounterType,
  icon: string | null,
  createdAt: string,
  [key: string]: unknown
}

export interface BinaryCounter extends Counter {
  type: CounterType.Binary,
  value: boolean
}

export interface  LimitedCounter extends Counter {
  type: CounterType.Limited,
  limit: number,
  current: number
}

export interface GoalCounter extends Counter {
  type: CounterType.Goal,
  current: number,
}
