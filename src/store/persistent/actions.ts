import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { Hash, PersistentStoreInterface, Profile } from './state'
import { LocalStorage } from 'quasar'
import { CordovaError } from 'src/other/filesystem'
import Filesystem from 'src/other/filesystem'
import { Counter } from 'src/store/persistent/counters-models'
import { IdGenerator } from 'src/other/encryption'
import { clone } from 'src/other/helper'

const fs = new Filesystem()

const actions: ActionTree<PersistentStoreInterface, StateInterface> = {
  async loadStore(context) {
    context.commit('startLoading')

    let store: PersistentStoreInterface | null = await fs.readCache()
      .then((text) => {
        if (!text.length) {
          return null
        }

        return JSON.parse(text) as PersistentStoreInterface
      })
      .catch((error: Error|CordovaError) => {
        if (error instanceof CordovaError) {
          return null
        }

        throw error
      }) || LocalStorage.getItem('store')

    if (store?.version === undefined) {
      store = null
    }

    if (store) {
      context.commit('updateStore', store)
    }

    context.commit('stopLoading')
  },
  updateDateCounter(context, data: {date: Date, hash: string, value: Counter}) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const store: PersistentStoreInterface = JSON.parse(JSON.stringify(context.state))

    if (!store.history.hasOwnProperty(data.date.toDateString())) {
      store.history[data.date.toDateString()] = { counters: {} }
    }

    store.history[data.date.toDateString()].counters[data.hash] = clone(data.value)

    context.commit('updateStore', store)
  },
  updateCounter(context, data: {counter: Counter, hash: Hash}) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const store: PersistentStoreInterface = JSON.parse(JSON.stringify(context.state))

    store.counters[data.hash] = clone(data.counter)

    context.commit('updateStore', store)
  },
  addCounter(context, counter: Counter) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const store: PersistentStoreInterface = JSON.parse(JSON.stringify(context.state))
    const generator = new IdGenerator()

    store.counters[generator.generate()] = clone(counter)

    context.commit('updateStore', store)
  },
  removeCounter(context, hash: Hash) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const store: PersistentStoreInterface = JSON.parse(JSON.stringify(context.state))

    delete store.counters[hash]

    context.commit('updateStore', store)
  },
  updateProfile(context, profile: Profile) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const store: PersistentStoreInterface = JSON.parse(JSON.stringify(context.state))

    store.profile = clone(profile)

    context.commit('updateStore', store)
  },
}

export default actions
