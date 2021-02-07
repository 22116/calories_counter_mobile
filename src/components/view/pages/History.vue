<template>
  <q-page class="justify-evenly">
    <history-calendar v-if='history.length' :history='history' :white-list-hashes='whitelist' class="row q-gutter-md q-pa-lg" />

    <div class="row q-gutter-md q-pa-lg">
      <q-badge color="red">Some of the counters are not passed</q-badge>
      <q-badge color="green">All counters reached</q-badge>
    </div>

    <div class="row q-gutter-md q-pa-lg text-grey">
      Help: Tap on the day to switch on the counter in the past. You can
      switch to the date where you already have registered counter.
    </div>

    <q-page-sticky position="top-right" :offset="[5, 25]">
      <q-btn fab icon="more_vert" color="primary" @click='() => showList = !showList' />
    </q-page-sticky>

    <whitelist v-if='counters.length' v-model='showList' :counters='counters' @update='(hashes) => this.whitelist = hashes' />
  </q-page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import HistoryCalendar from 'components/statistics/HistoryCalendar.vue'
import Whitelist from 'components/modals/counter/Whitelist.vue'
import { Counter, History } from 'src/core/entities'
import { Score } from 'src/core/entities/Counter'

@Component({
  components: { Whitelist, HistoryCalendar },
})
export default class PageHistory extends Vue {
  public history: Array<History> = []
  public counters: Array<Counter<Score>> = []
  public showList = false
  public whitelist = []

  constructor() {
    super()

    this.$q.loading.show()
  }

  async mounted() {
    this.history = await this.$orm.repository.history.findAll()
    this.counters = await this.$orm.repository.counter.findAll()

    this.$q.loading.hide()
  }
};
</script>

<style lang='sass'>
.q-date__header
  display: none
</style>
