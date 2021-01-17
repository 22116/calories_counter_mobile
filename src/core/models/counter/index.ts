import {BinaryCounter, BinaryCounterTheme} from 'src/core/models/counter/binary'
import {LimitedCounter, LimitedCounterTheme} from 'src/core/models/counter/limited'
import {GoalCounter, GoalCounterTheme} from 'src/core/models/counter/goal'

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
  theme: number,
  [key: string]: unknown
}

export {
  BinaryCounter, BinaryCounterTheme,
  LimitedCounter, LimitedCounterTheme,
  GoalCounter, GoalCounterTheme,
}
