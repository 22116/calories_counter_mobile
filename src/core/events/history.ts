import { ORM } from 'src/types/database'
import { Counter, History } from 'src/core/entities'
import { Score } from 'src/core/entities/Counter'
import { IdGenerator } from 'src/utility/encryption'

export async function historySaveEvent(orm: ORM, date: Date, counter: Counter<Score>) {
  let history = await orm.repository.history.findByDateAndCounterId(date, counter.id)

  if (history) {
    history.scores = counter.scores

    await orm.repository.history.update(history)
  } else {
    history = new History()
    history.id = new IdGenerator().generate()
    history.counter_id = counter.id
    history.date = date
    history.scores = counter.scores

    await orm.repository.history.save(history)
  }
}
