import { Counter, History } from 'src/core/entities'
import { IdGenerator } from 'src/utility/encryption'
import { Score } from 'src/core/entities/Counter'
import { singleton } from 'tsyringe'

@singleton()
export class HistoryService {
  create(counter: Counter<Score>) {
    const history = new History()
    history.date = new Date()
    history.scores = counter.scores
    history.counter_id = counter.id
    history.id = new IdGenerator().generate()

    return history
  }
}
