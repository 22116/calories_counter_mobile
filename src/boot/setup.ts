import { boot } from 'quasar/wrappers'
import { colors, Dark, Loading } from 'quasar'
import { VueConstructor } from 'vue'
import { SettingName } from 'src/core/entities/Setting'
import { Counter as Proxy, Score } from 'src/core/entities/Counter'
import { HistoryService } from 'src/core/services/HistoryService'
import Filesystem from 'src/utility/filesystem'
import { CounterType } from 'src/core/entities/Counter'
import { CounterService } from 'src/core/services/CounterService'

async function migrateDatabase(data: { Vue: VueConstructor }) {
  interface Counter {
    name: string,
    description: string,
    type: CounterType,
    icon: string | null,
    createdAt: string,
    theme: number,
    [key: string]: unknown
  }

  type Hash = string
  type History = Record<string, DayData>

  interface Profile {
    dark: boolean | string | null,
    theme: string,
  }

  interface DayData {
    counters: Record<Hash, Counter>,
  }

  interface Storage {
    profile: Profile,
    counters: Record<Hash, Counter>,
    history: History,
    version: number
  }

  function createProxy(counter: Counter, id: string): Proxy<Score> {
    const proxy = data.Vue.$container.resolve(CounterService).create()
    proxy.name = counter.name
    proxy.description = counter.description
    proxy.theme = counter.theme
    proxy.createdAt = new Date(counter.createdAt)
    proxy.id = id
    proxy.icon = counter.icon || 'label'
    proxy.type = counter.type

    switch (counter.type) {
      case CounterType.Binary:
        // @ts-ignore
        proxy.scores.value = counter.value

        break
      case CounterType.Limited:
        // @ts-ignore
        proxy.scores.current = counter.current
        // @ts-ignore
        proxy.scores.limit = counter.limit

        break
      case CounterType.Goal:
        // @ts-ignore
        proxy.scores.current = counter.current
        // @ts-ignore
        proxy.scores.start = counter.start

        break
    }

    return proxy
  }

  const fs = new Filesystem()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const storage = JSON.parse(await fs.readCache().catch(() => 'null')) as Storage|null

  if (!storage) {
    return
  }

  const dark = await data.Vue.$orm.repository.setting.find(SettingName.Dark)
  const theme = await data.Vue.$orm.repository.setting.find(SettingName.Theme)

  dark.value = storage.profile.dark
  theme.value = storage.profile.theme

  await data.Vue.$orm.repository.setting.save(dark)
  await data.Vue.$orm.repository.setting.save(theme)

  for (const id in storage.counters) {
    const counter = storage.counters[id]

    await data.Vue.$orm.repository.counter.save(createProxy(counter, id))
  }

  for (const dateString in storage.history) {
    const counters = storage.history[dateString].counters

    for (const id in counters) {
      const counter = counters[id]

      const proxy = data.Vue.$container.resolve(HistoryService).create(createProxy(counter, id))
      proxy.date = new Date(dateString)

      await data.Vue.$orm.repository.history.save(proxy)
    }
  }

  await fs.writeCache('null')
}

async function addMissedDays(data: { Vue: VueConstructor }) {
  const counters = await data.Vue.$orm.repository.counter.findAll()

  for (const counter of counters) {
    let history = await data.Vue.$orm.repository.history.findLast(counter)

    if (!history) {
      history = data.Vue.$container.resolve(HistoryService).create(counter)
      history.date = counter.createdAt

      await data.Vue.$orm.repository.history.save(history)
    }

    const date = new Date()

    while (history && history.date.getDate() < date.getDate()) {
      history.date.setDate(history.date.getDate() + 1)

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

export default boot(async (data: { Vue: VueConstructor }) => {
  Loading.show()

  // await migrateDatabase(data)
  await addMissedDays(data)
  await initializeSettings(data)

  Loading.hide()
})
