import { store } from 'quasar/wrappers'
import Vuex, {Store} from 'vuex'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StateInterface {}

export default store(function ({ Vue }): Store<StateInterface> {
  Vue.use(Vuex)

  return new Store<StateInterface>({
    modules: {},

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEBUGGING
  })
})
