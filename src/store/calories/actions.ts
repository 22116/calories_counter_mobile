import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { DayData, StoreInterface } from './state';
import { LocalStorage } from 'quasar';
import { CordovaError } from 'src/other/filesystem';
import Filesystem from 'src/other/filesystem';

const fs = new Filesystem();

const actions: ActionTree<StoreInterface, StateInterface> = {
  async loadStore(context) {
    context.commit('startLoading');

    const store: StoreInterface | null = await fs.readCache()
      .then((text) => {
        if (!text.length) {
          return null;
        }

        return JSON.parse(text) as StoreInterface;
      })
      .catch((error: Error|CordovaError) => {
        if (error instanceof CordovaError) {
          return null;
        }

        throw error;
      }) || LocalStorage.getItem('store');

    if (store) {
      context.commit('updateStore', store);
    }

    context.commit('stopLoading');
  },
  updateCounter(context, value: DayData) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const store: StoreInterface = JSON.parse(JSON.stringify(context.state));
    const data = store.history;
    const index = data.findIndex((day) => day.date === value.date)

    if (index !== -1) {
      data[index] = value;
    } else {
      data.push(value);
    }

    context.commit('updateStore', store);
  }
};

export default actions;
