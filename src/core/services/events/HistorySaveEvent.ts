import { HistoryService } from 'src/core/services/HistoryService'
import { Counter } from 'src/core/entities'
import { Score } from 'src/core/entities/Counter'
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
    const history = await this.historyRepository.findByDateAndCounterId(event.date, event.counter.id)

    if (history !== null) {
      history.scores = event.counter.scores

      await this.historyRepository.update(history)
    } else {
      await this.historyRepository.save(this.historyService.create(event.counter))
    }
  }

  supports(event: Event): boolean {
    return event instanceof HistorySaveEvent
  }
}
