import { column, ColumnType, database, Table } from 'websql-orm'
import { DB_NAME } from 'src/core/constants'

@database(DB_NAME, 'counters')
export class Counter<T extends Score> extends Table {
  @column(ColumnType.STRING | ColumnType.PRIMARY) id!: string
  @column(ColumnType.STRING) name!: string
  @column(ColumnType.STRING) description!: string
  @column(ColumnType.NUMBER) type!: CounterType
  @column(ColumnType.STRING) icon!: string
  @column(ColumnType.DATE) createdAt!: Date
  @column(ColumnType.NUMBER) theme!: number
  @column(ColumnType.ANY) scores!: T
  @column(ColumnType.BOOLEAN) enabled!: boolean
  @column(ColumnType.ANY) timeouts: Array<TimeoutList> = [TimeoutList.Daily]
}

export enum TimeoutList {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'saturday',
  Daily = 'daily',
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export type Score = BinaryCounterScore|GoalCounterScore|LimitedCounterScore

abstract class BaseScore {
  [key: string]: boolean|number
}

export class BinaryCounterScore extends BaseScore {
  value = false
}

export class GoalCounterScore extends BaseScore {
  current = 100
  start = 100
}

export class LimitedCounterScore extends BaseScore {
  current = 0
  limit = 2000
}

export enum CounterType {
  Limited,
  Binary,
  Goal
}

export enum BinaryCounterTheme {
  Default,
  Bear,
  Colorful,
}
