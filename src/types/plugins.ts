import { Vue } from 'vue/types/vue'
import { CounterRepository, HistoryRepository, SettingRepository } from 'src/core/repositories'
import { DependencyContainer } from 'tsyringe'

export type ORM = {
  repository: {
    setting: SettingRepository,
    counter: CounterRepository,
    history: HistoryRepository,
  }
}

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue> {
    $orm: ORM,
    $container: DependencyContainer
  }
}

declare module 'vue-property-decorator' {
  interface Vue {
    $orm: ORM,
    $container: DependencyContainer
  }
}
