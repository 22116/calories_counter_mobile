import { Repository } from 'src/core/repositories/Repository'
import { History } from 'src/core/entities/History'
import { Counter, Score } from 'src/core/entities/Counter'
import { sqlite } from 'websql-orm'
import { DB_NAME } from 'src/core/constants'
import { date } from 'quasar'
import formatDate = date.formatDate

export class HistoryRepository extends Repository<History> {
  factory(): History {
    return new History()
  }

  async findLast(counter: Counter<Score>): Promise<History> {
    return sqlite.fromSqlFirst(this.factory(), `
      SELECT * FROM history
      WHERE counter_id = :counter_id
      ORDER BY date DESC
      LIMIT 1
    `, [counter.id])
  }

  async findByDate(date: Date): Promise<Array<History>> {
    return await sqlite.fromSql(
      this.factory(),
      'SELECT * FROM history WHERE date(date) = date(:date)',
      [formatDate(date, 'YYYY-MM-DD')],
    )
  }

  async findByDateAndCounterId(date: Date, counterId: string): Promise<History|null> {
    return await sqlite.fromSqlFirst(
      this.factory(),
      'SELECT * FROM history WHERE date(date) = date(:date) AND counter_id = :counter_id',
      [formatDate(date, 'YYYY-MM-DD'), counterId],
    )
  }

  async findDailyCountersByDate(date: Date|null = null): Promise<Array<Counter<Score>>> {
    return sqlite.fromSqlByJs(
      DB_NAME,
      'SELECT date, counters.* FROM history CROSS JOIN counters WHERE date = :date',
      [date]
    ).then((data) => {
      return this.convertDailyCounters(data)[0] || []
    })
  }

  async findDailyCounters(): Promise<Record<string, Array<Counter<Score>>>> {
    return sqlite.fromSqlByJs(DB_NAME, 'SELECT date, counters.* FROM history CROSS JOIN counters', [])
      .then(this.convertDailyCounters.bind(this))
  }

  private convertDailyCounters(data: any[]): Record<string, Array<Counter<Score>>> {
    const result: Record<string, Array<Counter<Score>>> = {}

    data.forEach((row: Record<string, any>) => {
      if (!Array.isArray(result[row['date'] as string])) {
        result[row['date'] as string] = []
      }

      result[row['date'] as string].push(row as Counter<Score>)
    })

    return result
  }
}
