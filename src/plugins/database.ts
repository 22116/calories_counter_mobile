import { sqlite } from 'websql-orm'
import { CounterRepository, HistoryRepository, SettingRepository } from 'src/core/repositories'
import Vue from 'vue'

export default (app: typeof Vue) => {
  const orm = {
    db: sqlite,
    repository: {
      counter: Vue.$container.resolve(CounterRepository),
      setting: Vue.$container.resolve(SettingRepository),
      history: Vue.$container.resolve(HistoryRepository),
    },
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  app.prototype.$orm = orm
  app.$orm = orm
}
