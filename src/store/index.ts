import { store } from 'quasar/wrappers';
import Vuex from 'vuex';
import persistentStore from './persistent';
import { PersistentStoreInterface } from './persistent/state';

export interface StateInterface {
  persistent: PersistentStoreInterface;
}

export default store(function ({ Vue }) {
  Vue.use(Vuex);

  return new Vuex.Store<StateInterface>({
    modules: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      persistent: persistentStore,
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEBUGGING
  });
});
