import { MutationTree } from 'vuex';
import { StoreInterface } from './state';
import { LocalStorage } from 'quasar';
import Filesystem from 'src/other/filesystem';

const fs = new Filesystem();

const mutation: MutationTree<StoreInterface> = {
  async updateStore(state: StoreInterface, context: StoreInterface): Promise<void> {
    state.history = context.history;
    state.profile = context.profile;

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
