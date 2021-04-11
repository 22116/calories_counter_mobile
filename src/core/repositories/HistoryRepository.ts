import { Repository } from 'src/utility/database/Repository'
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
    return this.proxy.handle(
      sqlite.fromSqlFirst(this.factory(), `
        SELECT * FROM history
        WHERE counter_id = :counter_id
        ORDER BY date DESC
        LIMIT 1
      `, [counter.id])
    )
  }

  findByMonth(date: Date): Promise<Array<History>> {
    return this.proxy.handle(
      sqlite.fromSql(
        this.factory(),
          `
            SELECT *
            FROM history
            WHERE date(date) BETWEEN
                date(:date, 'start of month') AND
                date(:date, 'start of month', '+1 month', '-1 day')
          `,
          [date.toISOString()],
      )
    )
  }

  findByDateAndCounterId(date: Date, counterId: string): Promise<History|null> {
    return this.proxy.handle(
      sqlite.fromSqlFirst(
        this.factory(),
        'SELECT * FROM history WHERE date(date) = date(:date) AND counter_id = :counter_id',
        [date.toISOString(), counterId],
      )
    )
  }
}
