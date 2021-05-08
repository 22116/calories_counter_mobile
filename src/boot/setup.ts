import { boot } from 'quasar/wrappers'
import { colors, Dark, Loading } from 'quasar'
import { VueConstructor } from 'vue'
import { SettingDark, SettingName } from 'src/core/entities/Setting'
import { HistoryService } from 'src/core/services/HistoryService'
import { CounterService } from 'src/core/services/CounterService'
import { InMemory } from 'src/utility/database/proxy/InMemory'
import { generateMonthlyCacheKey } from 'src/utility/helper/string'
import { i18n } from 'boot/plugins'

function getDays(date: Date): number {
  return Math.floor(date.getTime() / 86400 / 1000)
}

async function addMissedDays(data: { Vue: VueConstructor }) {
  const counters = await data.Vue.$orm.repository.counter.findAll()
  const date = getDays(new Date())

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

    while (history && getDays(history.date) < date) {
      history.date.setTime(history.date.getTime() + (86400 * 1000))

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
  const dark = (await data.Vue.$orm.repository.setting.find(SettingName.Dark)).value as SettingDark
  const theme = (await data.Vue.$orm.repository.setting.find(SettingName.Theme)).value as string|null
  const locale = (await data.Vue.$orm.repository.setting.find(SettingName.Locale)).value as string|null

  if (dark !== null || dark === 'auto') {
    Dark.set(dark as boolean|'auto')
  }

  if (theme) {
    colors.setBrand('primary', theme)
  }

  if (locale) {
    i18n.locale = locale
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
