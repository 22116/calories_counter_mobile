import { injectAll, registry, singleton } from 'tsyringe'
import {
  CounterCreatedEventHandler,
  CounterDeletedEventHandler,
  CounterUpdatedEventHandler,
  HistorySaveEventHandler
} from 'src/core/services/events'
import { Event, EventHandler } from 'src/core/services/events/models'

@singleton()
@registry([
  {token: 'EventHandler', useClass: HistorySaveEventHandler},
  {token: 'EventHandler', useClass: CounterUpdatedEventHandler},
  {token: 'EventHandler', useClass: CounterDeletedEventHandler},
  {token: 'EventHandler', useClass: CounterCreatedEventHandler},
])
export class EventService {
  constructor(@injectAll('EventHandler') private handlers: Array<EventHandler>) { }

  async dispatch(event: Event) {
    for (const handler of this.handlers) {
      if (handler.supports(event)) {
        await handler.handle(event)
      }
    }
  }

  async dispatchAll(...events: Array<Event>) {
    for (const event of events) {
      await this.dispatch(event)
    }
  }
}
