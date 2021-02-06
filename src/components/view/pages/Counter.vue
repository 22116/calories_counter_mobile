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
import CounterView from 'components/CounterView.vue'
import { History } from 'src/core/entities'
import { historySaveEvent } from 'src/core/events/history'

@Component({
  components: { CounterView, GoalCounter, BinaryCounter, LimitedCounter }
})
export default class PageCounter extends CounterTypeMixin {
  public counter: Counter<Score> = {}

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

    let history = (await this.$orm.repository.history.findByDate(new Date(this.$route.params.date),))
      ?.find((history: History) => history.counter_id === this.$route.params.hash)

    if (history) {
      counter.scores = history.scores
    }

    this.counter = counter
    this.$q.loading.hide()
  }

  @Watch('counter', {deep: true})
  async updateCounterData() {
    await historySaveEvent(this.$orm, new Date(this.$route.params.date), this.counter)
  }
}
</script>
