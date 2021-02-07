import { Repository } from 'src/core/repositories/Repository'
import { History } from 'src/core/entities/History'
import { Counter, Score } from 'src/core/entities/Counter'
import { sqlite } from 'websql-orm'
import { singleton } from 'tsyringe'

@singleton()
export class HistoryRepository extends Repository<History> {
  factory(): History {
    return new History()
  }

  findLast(counter: Counter<Score>): Promise<History> {
    return sqlite.fromSqlFirst(this.factory(), `
      SELECT * FROM history
      WHERE counter_id = :counter_id
      ORDER BY date DESC
      LIMIT 1
    `, [counter.id])
  }

  findByDate(date: Date): Promise<Array<History>> {
    return sqlite.fromSql(
      this.factory(),
      'SELECT * FROM history WHERE date(date) = date(:date)',
      [date.toISOString()],
    )
  }

  findByDateAndCounterId(date: Date, counterId: string): Promise<History|null> {
    return sqlite.fromSqlFirst(
      this.factory(),
      'SELECT * FROM history WHERE date(date) = date(:date) AND counter_id = :counter_id',
      [date.toISOString(), counterId],
    )
  }
}
