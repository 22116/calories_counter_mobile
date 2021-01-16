/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */

import {boot} from 'quasar/wrappers'
import {StateInterface} from 'src/store'
import {Dark, Loading, colors} from 'quasar'
import {Store} from 'vuex'
import {Counter} from 'src/store/persistent/counters-models'
import {clone} from 'src/other/helper'
import {Profile} from 'src/store/persistent/state'

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
      if (!history[date.toDateString()]) {
        await data.store.dispatch('persistent/updateDateCounter', {
          date: new Date(date),
          counter: clone(counter)
        })
      }

      date.setDate(date.getDate() + 1)
    }
  }
}

function initializeSettings(data: { store: Store<StateInterface> }) {
  const profile: Profile = Object.assign(data.store.getters['persistent/profile'])

  if (profile.dark !== null) {
    Dark.set(profile.dark)
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
