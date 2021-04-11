import { Counter, History } from 'src/core/entities'
import { IdGenerator } from 'src/utility/encryption'
import { Score } from 'src/core/entities/Counter'
import { inject, injectable } from 'tsyringe'
import { HistoryRepository } from 'src/core/repositories'

@injectable()
export class HistoryService {
  public constructor(@inject(HistoryRepository) private historyRepository: HistoryRepository) { }

  create(counter: Counter<Score>) {
    const history = new History()
    history.date = new Date()
    history.scores = counter.scores
    history.counter_id = counter.id
    history.id = new IdGenerator().generate()

    return history
  }

  async save(counter: Counter<Score>, date: Date): Promise<History> {
    let history = await this.historyRepository.findByDateAndCounterId(date, counter.id)

    if (history) {
      history.scores = counter.scores

      await this.historyRepository.update(history)
    } else {
      history = this.create(counter)

      await this.historyRepository.save(history)
    }

    return history
  }
}
