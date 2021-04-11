<template>
  <div>
    <streak-table v-if='loaded' v-model='history' />
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import StreakTable from 'components/statistics/StreakTable.vue'
import { History } from 'src/core/entities'
import { InMemory } from 'src/utility/database/proxy/InMemory'

@Component({
  components: { StreakTable }
})
export default class Statistics extends Vue {
  public history: Array<History> = []
  public loaded = false

  constructor() {
    super()

    this.$q.loading.show()
  }

  async mounted() {
    this.history = await this.$orm.repository.history.setProxy(new InMemory()).findAll()

    this.loaded = true

    this.$q.loading.hide()
  }
}
</script>
