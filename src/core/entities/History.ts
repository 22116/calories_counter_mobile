import { column, ColumnType, database, reference, Table } from 'websql-orm'
import { Counter, Score } from 'src/core/entities/Counter'
import { DB_NAME } from 'src/core/constants'

@database(DB_NAME, 'history')
export class History extends Table {
  @column(ColumnType.STRING | ColumnType.PRIMARY) id!: string
  @column(ColumnType.DATE) date!: Date
  @column(ColumnType.STRING) counter_id!: string
  @column(ColumnType.ANY) scores!: Score

  @reference('counter_id', new Counter(), 'id') counter!: Array<Counter<Score>>

  getCounter(): Counter<Score> {
    const counter = this.counter[0]

    counter.scores = this.scores

    return counter
  }
}
