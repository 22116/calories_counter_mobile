import { store } from 'quasar/wrappers';
import Vuex from 'vuex';
import defaultStore from './calories';
import { StoreInterface } from './calories/state';

export interface StateInterface {
  calories: StoreInterface;
}

export default store(function ({ Vue }) {
  Vue.use(Vuex);

  return new Vuex.Store<StateInterface>({
    modules: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      calories: defaultStore,
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEBUGGING
  });
});
