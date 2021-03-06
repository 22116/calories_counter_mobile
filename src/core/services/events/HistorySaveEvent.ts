import { HistoryService } from 'src/core/services/HistoryService'
import { Counter } from 'src/core/entities'
import { Score } from 'src/core/entities/Counter'
import { HistoryRepository } from 'src/core/repositories'
import { inject, injectable } from 'tsyringe'
import { EventHandler, Event } from 'src/core/services/events/models'
import { InMemory } from 'src/utility/database/proxy/InMemory'
import { generateMonthlyCacheKey } from 'src/utility/helper/string'

export class HistorySaveEvent implements Event {
  constructor(public counter: Counter<Score>, public date: Date) {}
}

@injectable()
export class HistorySaveEventHandler implements EventHandler {
  constructor(
    @inject(HistoryService) private historyService: HistoryService,
    @inject(HistoryRepository) private historyRepository: HistoryRepository,
  ) { }

  async handle(event: HistorySaveEvent) {
    const oldHistory = await this.historyRepository.findByDateAndCounter(event.date, event.counter)
    const newHistory = await this.historyService.save(event.counter, event.date)

    if (JSON.stringify(oldHistory?.scores) !== JSON.stringify(newHistory?.scores)) {
      void this.historyRepository
        .setProxy(new InMemory(generateMonthlyCacheKey(event.date)))
        .clear()
        .findByMonth(event.date)
      void this.historyRepository.setProxy(new InMemory()).clear().findAll()
      await this.historyRepository
        .setProxy(new InMemory(event.counter.id + event.date.toISOString()))
        .clear()
        .findByDateAndCounter(event.date, event.counter)
    }
  }

  supports(event: Event): boolean {
    return event instanceof HistorySaveEvent
  }
}
