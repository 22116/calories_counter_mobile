import { MutationTree } from 'vuex'
import { PersistentStoreInterface } from './state'
import { LocalStorage } from 'quasar'
import Filesystem from 'src/utility/filesystem'

const fs = new Filesystem()

const mutation: MutationTree<PersistentStoreInterface> = {
  async updateStore(state: PersistentStoreInterface, context: PersistentStoreInterface): Promise<void> {
    for (const key in state) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      state[key] = context[key]
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await fs.writeCache(JSON.stringify(state)).catch(() => {})

    LocalStorage.set('store', state)
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  startLoading() { },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stopLoading() { },
}

export default mutation
