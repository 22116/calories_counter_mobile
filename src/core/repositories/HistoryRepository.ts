import { Repository } from 'src/utility/database/Repository'
import { History } from 'src/core/entities/History'
import { Counter, Score, TimeoutList } from 'src/core/entities/Counter'
import { sqlite } from 'websql-orm'
import { singleton } from 'tsyringe'
import { getRelativeDayInWeek } from 'src/utility/helper'

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

  findByDateAndCounter(date: Date, counter: Counter<Score>): Promise<History|null> {
    const dates = counter.timeouts.map((timeout) => {
      let date = new Date()

      switch (timeout) {
        case TimeoutList.Monday:
          date = getRelativeDayInWeek(date, 1)
          break
        case TimeoutList.Tuesday:
          date = getRelativeDayInWeek(date, 2)
          break
        case TimeoutList.Wednesday:
          date = getRelativeDayInWeek(date, 3)
          break
        case TimeoutList.Thursday:
          date = getRelativeDayInWeek(date, 4)
          break
        case TimeoutList.Friday:
          date = getRelativeDayInWeek(date, 5)
          break
        case TimeoutList.Saturday:
          date = getRelativeDayInWeek(date, 6)
          break
        case TimeoutList.Sunday:
          date = getRelativeDayInWeek(date, 0)
          break
        case TimeoutList.Monthly:
          date.setDate(1)
          break
        case TimeoutList.Yearly:
          date.setDate(1)
          date.setMonth(1)
          break
      }

      return date
    })

    const minDate = dates.sort((a, b) => {
      return a.getTime() === b.getTime() ? 0 : (a.getTime() < b.getDate() ? 1 : -1)
    })[0]

    return this.proxy.handle(
      sqlite.fromSqlFirst(
        this.factory(),
        `
            SELECT *
            FROM history
            WHERE (date(date) BETWEEN date(:min) AND date(:max) OR date(date) = date(:max)) AND
                  counter_id = :counter_id
            ORDER BY date(date)
        `,
        [minDate.toISOString(), date.toISOString(), counter.id],
      )
    )
  }
}
