import { sqlite } from 'websql-orm'
import { CounterRepository, HistoryRepository, SettingRepository } from 'src/core/repositories'
import _Vue from 'vue'

export default (Vue: typeof _Vue) => {
  const orm = {
    db: sqlite,
    repository: {
      counter: Vue.$container.resolve(CounterRepository),
      setting: Vue.$container.resolve(SettingRepository),
      history: Vue.$container.resolve(HistoryRepository),
    },
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.prototype.$orm = orm
  Vue.$orm = orm
}
