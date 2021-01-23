import { Counter, CounterType } from 'src/core/models/counter/index'

export enum GoalCounterTheme {
  Default
}

export interface GoalCounter extends Counter {
  type: CounterType.Goal,
  theme: GoalCounterTheme,
  current: number,
  start: number
}
