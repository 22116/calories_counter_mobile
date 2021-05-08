/// <reference types="@havesource/cordova-plugin-push/types" />
import { boot } from 'quasar/wrappers'
import { Message, Notification } from 'src/utility/notification'
import BackgroundFetch from 'cordova-plugin-background-fetch'
import { CounterService } from 'src/core/services/CounterService'
import { CounterType } from 'src/core/entities/Counter'
import { EventService } from 'src/core/services/EventService'
import { HistorySaveEvent } from 'src/core/services/events'
import { InMemory } from 'src/utility/database/proxy/InMemory'

export default boot(async (data) => {
  const push = PushNotification.init({
    android: {},
  })

  push.on('registration', (data) => {
    console.log('FireBase registration id: ' + data.registrationId)
  })

  push.on('notification', (data) => {
    Notification.send({ id: Math.floor(Math.random() * 10 ** 9), title: data.title, text: data.message })
  })

  push.on('error', (error) => {
    console.error(error)
  })

  const onEvent = async (taskId: any) => {
    console.log('[Background] event received: ', taskId)

    const counters = await data.Vue.$orm.repository.counter
      .setProxy(new InMemory())
      .findAll()
    const date = new Date()

    for (const counter of counters) {
      if (!counter.enabled) continue

      const current = await data.Vue.$orm.repository.history
        .setProxy(new InMemory(counter.id + date.toISOString()))
        .findByDateAndCounter(date, counter)

      if (current) {
        counter.scores = current?.scores
      }

      if (!data.Vue.$container.resolve(CounterService).isSucceed(counter)) {
        const message: Message = {
          id: counter.rowid,
          title: counter.name,
          text: 'You have something to do today',
        }

        if ([CounterType.Binary, CounterType.Goal].includes(counter.type)) {
          message.actions = [
            {
              id: counter.id,
              type: 'button',
              title: 'Complete',
              callback() {
                switch (counter.type) {
                  case CounterType.Goal: counter.scores.current = 0; break
                  case CounterType.Binary: counter.scores.value = true; break
                }

                void data.Vue.$container
                  .resolve(EventService)
                  .dispatch(new HistorySaveEvent(counter, date))
              }
            },
            { id: 'cancel', type: 'button', title: 'Skip' },
          ]
        }

        Notification.send(message)
      }
    }



    // Required: Signal completion of your task to native code
    // If you fail to do this, the OS can terminate your app
    // or assign battery-blame for consuming too much background-time
    BackgroundFetch.finish(taskId)
  }

  // Timeout callback is executed when your Task has exceeded its allowed running-time.
  // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
  const onTimeout = async (taskId: any) => {
    console.log('[Background] TIMEOUT: ', taskId)
    BackgroundFetch.finish(taskId)
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  void BackgroundFetch.configure({minimumFetchInterval: 900}, onEvent, onTimeout)
})
