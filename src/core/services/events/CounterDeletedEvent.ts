import { Counter } from 'src/core/entities'
import { Score } from 'src/core/entities/Counter'
import { CounterRepository } from 'src/core/repositories'
import { inject, injectable } from 'tsyringe'
import { Notify } from 'quasar'
import { Event, EventHandler } from 'src/core/services/events/models'

export class CounterDeletedEvent implements Event {
  public constructor(public counter: Counter<Score>) { }
}

@injectable()
export class CounterDeletedEventHandler implements EventHandler {
  constructor(@inject(CounterRepository) private counterRepository: CounterRepository) { }

  async handle(event: CounterDeletedEvent) {
    event.counter.enabled = false

    await this.counterRepository.update(event.counter)

    Notify.create({
      type: 'positive',
      message: 'Counter successfully deleted'
    })
  }

  supports(event: Event): boolean {
    return event instanceof CounterDeletedEvent
  }
}
