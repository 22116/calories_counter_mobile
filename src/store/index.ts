import { store } from 'quasar/wrappers'
import Vuex, {Store} from 'vuex'
import persistentModule from './persistent'
import { PersistentStoreInterface } from './persistent/state'

export interface StateInterface {
  persistent: PersistentStoreInterface;
}

export default store(function ({ Vue }): Store<StateInterface> {
  Vue.use(Vuex)

  return new Store<StateInterface>({
    modules: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      persistent: persistentModule,
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEBUGGING
  })
})
