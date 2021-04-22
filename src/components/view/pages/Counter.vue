<template>
  <counter-view v-if='counter' v-model='counter' />
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { Counter, Score } from 'src/core/entities/counter'
import LimitedCounter from 'components/counters/LimitedCounter.vue'
import BinaryCounter from 'components/counters/BinaryCounter.vue'
import GoalCounter from 'components/counters/GoalCounter.vue'
import CounterTypeMixin from 'components/mixins/CounterTypeMixin'
import CounterView from 'components/view/CounterView.vue'
import { EventService } from 'src/core/services/EventService'
import { HistorySaveEvent } from 'src/core/services/events'

@Component({
  components: { CounterView, GoalCounter, BinaryCounter, LimitedCounter }
})
export default class PageCounter extends CounterTypeMixin {
  public counter: Partial<Counter<Score>> = {}

  constructor() {
    super()

    this.$q.loading.show()
  }

  async mounted() {
    const counter = await this.$orm.repository.counter.find(this.$route.params.hash)

    if (!counter) {
      console.error('Cannot find counter object')

      return
    }

    let history = await this.$orm.repository.history.findByDateAndCounter(
      new Date(this.$route.params.date),
      counter
    )

    this.counter = history ? history.getCounter() : counter
    this.$q.loading.hide()
  }

  @Watch('counter', {deep: true})
  async updateCounterData() {
    await this.$container
      .resolve(EventService)
      .dispatch(new HistorySaveEvent(this.counter as Counter<Score>, new Date(this.$route.params.date)))
  }
}
</script>
