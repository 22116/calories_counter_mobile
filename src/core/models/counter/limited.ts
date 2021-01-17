import { Counter, CounterType } from 'src/core/models/counter/index'

export enum LimitedCounterTheme {
  Default
}

export interface  LimitedCounter extends Counter {
  type: CounterType.Limited,
  theme: LimitedCounterTheme,
  limit: number,
  current: number
}
