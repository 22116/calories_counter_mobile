import { boot } from 'quasar/wrappers'
import { colors, Dark, Loading } from 'quasar'
import { VueConstructor } from 'vue'
import { SettingName } from 'src/core/entities/Setting'
import { History } from 'src/core/entities/History'
import { IdGenerator } from 'src/utility/encryption'

async function addMissedDays(data: { Vue: VueConstructor }) {
  const counters = await data.Vue.$orm.repository.counter.findAll()

  for (const counter of counters) {
    const date = new Date()
    const history = await data.Vue.$orm.repository.history.findLast(counter)

    while (history && history.date.toDateString() !== date.toDateString()) {
      const history = new History()
      history.id = new IdGenerator().generate()
      history.counter_id = counter.id
      history.scores = counter.scores

      await data.Vue.$orm.repository.history.save(history)

      date.setDate(date.getDate() + 1)
    }
  }
}

async function initializeSettings(data: { Vue: VueConstructor }) {
  const dark = (await data.Vue.$orm.repository.setting.find(SettingName.Dark)).value as null|'auto'|boolean
  const theme = (await data.Vue.$orm.repository.setting.find(SettingName.Theme)).value as null|string

  if (dark !== null || dark === 'auto') {
    Dark.set(dark)
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
