import { HistoryService } from 'src/core/services/HistoryService'
import { Counter, History } from 'src/core/entities'
import { Score } from 'src/core/entities/Counter'
import { IdGenerator } from 'src/utility/encryption'
import { HistoryRepository } from 'src/core/repositories'
import { inject, injectable } from 'tsyringe'
import { EventHandler, Event } from 'src/core/services/events/models'

export class HistorySaveEvent implements Event {
  constructor(public counter: Counter<Score>, public date: Date) {}
}

@injectable()
export class HistorySaveEventHandler implements EventHandler {
  constructor(
    @inject(HistoryService) private historyService: HistoryService,
    @inject(HistoryRepository) private historyRepository: HistoryRepository
  ) { }

  async handle(event: HistorySaveEvent) {
    let history = await this.historyRepository.findByDateAndCounterId(event.date, event.counter.id)

    if (history !== null) {
      history.scores = event.counter.scores

      await this.historyRepository.update(history)
    } else {
      history = new History()
      history.id = new IdGenerator().generate()
      history.counter_id = event.counter.id
      history.date = event.date
      history.scores = event.counter.scores

      await this.historyRepository.save(history)
    }
  }

  supports(event: Event): boolean {
    return event instanceof HistorySaveEvent
  }
}
