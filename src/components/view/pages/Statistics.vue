<template>
  <div>
    <streak-table v-if='loaded' v-model='history' />
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import StreakTable from 'components/statistics/StreakTable.vue'
import { History } from 'src/core/entities'

@Component({
  components: { StreakTable }
})
export default class Statistics extends Vue {
  public history: Array<History> = []
  public loaded = false

  async mounted() {
    this.history = await this.$orm.repository.history.findAll()
    this.loaded = true
  }
}
</script>
