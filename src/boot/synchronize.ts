/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */

import {boot} from 'quasar/wrappers'
import {StateInterface} from 'src/store'
import {Dark, Loading, colors} from 'quasar'
import {Store} from 'vuex'
import { Counter, CounterType } from 'src/core/models/counter'
import { DayData, Profile } from 'src/store/persistent/state'

async function backwardCompatibility(data: { store: Store<StateInterface> }) {
  const counters = data.store.getters['persistent/userCounters']

  for (const hash in counters) {
    if (!counters[hash].createdAt) {
      counters[hash].createdAt = new Date().toDateString()

      await data.store.dispatch('persistent/updateCounter', {
        counter: counters[hash],
        hash
      })
    }

    if (counters[hash].theme === undefined) {
      // 0 always refers to default theme on each counter type
      counters[hash].theme = 0

      await data.store.dispatch('persistent/updateCounter', {
        counter: counters[hash],
        hash
      })
    }

    if (counters[hash].type === CounterType.Goal && counters[hash].start === undefined) {
      // 0 always refers to default theme on each counter type
      counters[hash].start = counters[hash].current

      await data.store.dispatch('persistent/updateCounter', {
        counter: counters[hash],
        hash
      })
    }
  }
}

async function addMissedDays(data: { store: Store<StateInterface> }) {
  const today = new Date()
  const counters = data.store.getters['persistent/userCounters']
  const history = data.store.getters['persistent/history']

  for (const hash in counters) {
    const counter: Counter = counters[hash]
    const date = new Date(counter.createdAt)

    while (date.toDateString() !== today.toDateString()) {
      const day: DayData|undefined = history[date.toDateString()]

      if (!day || (day && !day.counters[hash])) {
        await data.store.dispatch('persistent/updateDateCounter', {
          date: new Date(date),
          counter,
          hash
        })
      }

      date.setDate(date.getDate() + 1)
    }
  }
}

function initializeSettings(data: { store: Store<StateInterface> }) {
  const profile: Profile = Object.assign(data.store.getters['persistent/profile'])

  if (profile.dark !== null && profile.dark !== 'auto') {
    Dark.set(!!profile.dark)
  }

  if (profile.theme) {
    colors.setBrand('primary', profile.theme)
  }
}

export default boot(async (data: { store: Store<StateInterface> }) => {
  Loading.show()

  await data.store.dispatch('persistent/loadStore')
  await backwardCompatibility(data)
  await addMissedDays(data)
  initializeSettings(data)

  Loading.hide()
})
