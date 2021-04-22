import { HistoryService } from 'src/core/services/HistoryService'
import { Counter } from 'src/core/entities'
import { Score } from 'src/core/entities/Counter'
import { CounterRepository } from 'src/core/repositories'
import { inject, injectable } from 'tsyringe'
import { Notify } from 'quasar'
import { Event, EventHandler } from 'src/core/services/events/models'
import { InMemory } from 'src/utility/database/proxy/InMemory'

export class CounterUpdatedEvent implements Event {
  public constructor(public counter: Counter<Score>) { }
}

@injectable()
export class CounterUpdatedEventHandler implements EventHandler {
  constructor(
    @inject(HistoryService) private historyService: HistoryService,
    @inject(CounterRepository) private counterRepository: CounterRepository,
  ) { }

  async handle(event: CounterUpdatedEvent) {
    await this.counterRepository.save(event.counter)
    void this.counterRepository.setProxy(new InMemory()).clear().findAll()

    Notify.create({
      type: 'positive',
      message: 'Counter successfully updated'
    })
  }

  supports(event: Event): boolean {
    return event instanceof CounterUpdatedEvent
  }
}
