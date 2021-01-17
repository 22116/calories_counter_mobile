/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call */

import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { DayData, Profile, PersistentStoreInterface, Hash } from './state'
import { Counter } from 'src/store/persistent/counters-models'
import { clone } from 'src/other/helper'

const getters: GetterTree<PersistentStoreInterface, StateInterface> = {
  history(state): Record<string, DayData> {
    return clone(state.history)
  },
  profile(state): Profile {
    return clone(state.profile)
  },
  userCounters(state): Record<Hash, Counter> {
    return clone(state.counters)
  },
  userCounterByHash: (state, getters) => (hash: Hash): Counter|null => {
    return clone(getters.userCounters[hash] || null)
  },
  counterByHash: (state, getters) => (date: Date, hash: Hash): Counter|null => {
    return clone(getters.day(date).counters[hash] || getters.userCounterByHash(hash))
  },
  day: (state) => (date: Date) => {
    return clone(state.history[date.toDateString()] || { counters: {} })
  }
}

export default getters
