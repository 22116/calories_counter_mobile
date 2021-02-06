import { Counter, Score } from 'src/core/entities/counter'
import {Notify} from 'quasar'
import { ORM } from 'src/types/database'
import { History } from 'src/core/entities'
import { IdGenerator } from 'src/utility/encryption'

export async function counterCreatedEvent(orm: ORM, counter: Counter<Score>) {
  await orm.repository.counter.save(counter)

  Notify.create({
    type: 'positive',
    message: 'Counter successfully created'
  })
}

export async function counterDeletedEvent(orm: ORM, counter: Counter<Score>) {
  counter.enabled = false

  await orm.repository.counter.update(counter)

  Notify.create({
    type: 'positive',
    message: 'Counter successfully deleted'
  })
}

export async function counterUpdatedEvent(orm: ORM, counter: Counter<Score>) {
  await orm.repository.counter.save(counter)
  const history = await orm.repository.history.findByDateAndCounterId(new Date(), counter.id)

  if (history) {
    history.scores = counter.scores

    await orm.repository.history.update(history)
  } else {
    const history = new History()
    history.date = new Date()
    history.scores = counter.scores
    history.counter_id = counter.id
    history.id = new IdGenerator().generate()

    await orm.repository.history.save(history)
  }

  Notify.create({
    type: 'positive',
    message: 'Counter successfully updated'
  })
}
