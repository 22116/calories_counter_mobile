import { Counter, CounterType } from 'src/core/models/counter/index'

export enum BinaryCounterTheme {
  Default,
  Bear
}

export interface BinaryCounter extends Counter {
  type: CounterType.Binary,
  theme: BinaryCounterTheme,
  value: boolean
}
