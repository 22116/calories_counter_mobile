import { Counter, CounterType } from 'src/core/models/counter/index'

export enum BinaryCounterTheme {
  Default,
  Smile,
  Vampire,
  Circle
}

export interface BinaryCounter extends Counter {
  type: CounterType.Binary,
  theme: BinaryCounterTheme,
  value: boolean
}
