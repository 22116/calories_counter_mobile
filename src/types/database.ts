import { Vue } from 'vue/types/vue'
import { CounterRepository, HistoryRepository, SettingRepository } from 'src/core/repositories'

export type ORM = {
  repository: {
    setting: SettingRepository,
    counter: CounterRepository,
    history: HistoryRepository,
  }
}

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue> {
    $orm: ORM
  }
}

declare module 'vue-property-decorator' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  class Vue {
    $orm: ORM
  }
}
