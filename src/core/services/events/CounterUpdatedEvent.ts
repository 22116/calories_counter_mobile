import { HistoryService } from 'src/core/services/HistoryService'
import { Counter } from 'src/core/entities'
import { Score } from 'src/core/entities/Counter'
import { CounterRepository } from 'src/core/repositories'
import { inject, injectable } from 'tsyringe'
import { Notify } from 'quasar'
import { Event, EventHandler } from 'src/core/services/events/models'

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

    Notify.create({
      type: 'positive',
      message: 'Counter successfully updated'
    })
  }

  supports(event: Event): boolean {
    return event instanceof CounterUpdatedEvent
  }
}
