import {Counter} from 'src/store/persistent/counters-models'
import {Notify} from 'quasar'
import {Hash} from 'src/store/persistent/state'
import {Store} from 'vuex'
import {StateInterface} from 'src/store'

export async function counterCreatedEvent(store: Store<StateInterface>, counter: Counter) {
  await store.dispatch('persistent/addCounter', counter)

  Notify.create({
    type: 'positive',
    message: 'Counter successfully created'
  })
}

export async function counterDeletedEvent(store: Store<StateInterface>, hash: Hash) {
  await store.dispatch('persistent/removeCounter', hash)

  Notify.create({
    type: 'positive',
    message: 'Counter successfully deleted'
  })
}

export async function counterUpdatedEvent(store: Store<StateInterface>, hash: Hash, counter: Counter) {
  await store.dispatch('persistent/updateCounter', { counter, hash })

  Notify.create({
    type: 'positive',
    message: 'Counter successfully updated'
  })
}
