import { boot } from 'quasar/wrappers'
import { colors, Dark, Loading } from 'quasar'
import { VueConstructor } from 'vue'
import { SettingName } from 'src/core/entities/Setting'
import { HistoryService } from 'src/core/services/HistoryService'
import { CounterService } from 'src/core/services/CounterService'
import { InMemory } from 'src/utility/database/proxy/InMemory'
import { generateMonthlyCacheKey } from 'src/utility/helper/string'

async function addMissedDays(data: { Vue: VueConstructor }) {
  const counters = await data.Vue.$orm.repository.counter.findAll()

  for (const counter of counters) {
    if (!counter.enabled) {
      continue
    }

    let history = await data.Vue.$orm.repository.history.findLast(counter)

    if (!history) {
      history = data.Vue.$container.resolve(HistoryService).create(counter)
      history.date = counter.createdAt

      await data.Vue.$orm.repository.history.save(history)
    }

    const date = new Date()

    while (history && history.date.getDate() < date.getDate()) {
      history.date.setDate(history.date.getDate() + 1)

      if (!data.Vue.$container.resolve(CounterService).isDue(history.getCounter(), history.date)) {
        continue
      }

      const day = data.Vue.$container.resolve(HistoryService).create(counter)
      day.date = history.date

      await data.Vue.$orm.repository.history.save(day)
    }
  }
}

async function initializeSettings(data: { Vue: VueConstructor }) {
  const dark = (await data.Vue.$orm.repository.setting.find(SettingName.Dark)).value as null|'auto'|boolean
  const theme = (await data.Vue.$orm.repository.setting.find(SettingName.Theme)).value as null|string

  if (dark !== null || dark === 'auto') {
    Dark.set(dark as boolean|'auto')
  }

  if (theme) {
    colors.setBrand('primary', theme)
  }
}

async function loadDataAsync(data: { Vue: VueConstructor }) {
  await data.Vue.$orm.repository.counter.setProxy(new InMemory()).findAll()
  await data.Vue.$orm.repository.history.setProxy(new InMemory()).findAll()
  await data.Vue.$orm.repository.history
    .setProxy(new InMemory(generateMonthlyCacheKey(new Date())))
    .findByMonth(new Date())
}

export default boot(async (data: { Vue: VueConstructor }) => {
  Loading.show()

  await addMissedDays(data)
  await initializeSettings(data)
  void loadDataAsync(data)

  Loading.hide()
})
