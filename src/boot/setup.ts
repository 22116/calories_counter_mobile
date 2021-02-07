import { boot } from 'quasar/wrappers'
import { colors, Dark, Loading } from 'quasar'
import { VueConstructor } from 'vue'
import { SettingName } from 'src/core/entities/Setting'
import { History } from 'src/core/entities/History'
import { IdGenerator } from 'src/utility/encryption'

async function addMissedDays(data: { Vue: VueConstructor }) {
  const counters = await data.Vue.$orm.repository.counter.findAll()

  for (const counter of counters) {
    let history = await data.Vue.$orm.repository.history.findLast(counter)

    if (!history) {
      history = new History()
      history.id = new IdGenerator().generate()
      history.counter_id = counter.id
      history.scores = counter.scores
      history.date = counter.createdAt

      await data.Vue.$orm.repository.history.save(history)
    }

    const date = new Date()

    while (history && history.date.getDate() < date.getDate()) {
      history.date.setDate(history.date.getDate() + 1)

      const day = new History()
      day.id = new IdGenerator().generate()
      day.counter_id = counter.id
      day.scores = counter.scores
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

  await addMissedDays(data)
  await initializeSettings(data)

  Loading.hide()
})
