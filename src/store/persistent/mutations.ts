import { MutationTree } from 'vuex';
import { PersistentStoreInterface } from './state';
import { LocalStorage } from 'quasar';
import Filesystem from 'src/other/filesystem';

const fs = new Filesystem();

const mutation: MutationTree<PersistentStoreInterface> = {
  async updateStore(state: PersistentStoreInterface, context: PersistentStoreInterface): Promise<void> {
    state.history = context.history;
    state.profile = context.profile;
    state.counters = context.counters;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await fs.writeCache(JSON.stringify(state)).catch(() => {});

    LocalStorage.set('store', state);
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  startLoading() { },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stopLoading() { },
};

export default mutation;
