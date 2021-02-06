import { column, ColumnType, database, Table } from 'websql-orm'
import { Score } from 'src/core/entities/Counter'
import { DB_NAME } from 'src/core/constants'

@database(DB_NAME, 'history')
export class History extends Table {
  @column(ColumnType.STRING | ColumnType.PRIMARY) id!: string
  @column(ColumnType.DATE) date!: Date
  @column(ColumnType.STRING) counter_id!: string
  @column(ColumnType.ANY) scores!: Score
}
