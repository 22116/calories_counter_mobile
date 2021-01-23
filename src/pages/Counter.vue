<template>
  <counter-view v-model='counter' />
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { Counter } from 'src/core/models/counter'
import LimitedCounter from 'components/counters/LimitedCounter.vue'
import BinaryCounter from 'components/counters/BinaryCounter.vue'
import GoalCounter from 'components/counters/GoalCounter.vue'
import CounterTypeMixin from 'components/mixins/CounterTypeMixin'
import CounterView from 'components/CounterView.vue'

@Component({
  components: { CounterView, GoalCounter, BinaryCounter, LimitedCounter }
})
export default class PageCounter extends CounterTypeMixin {
  public counter!: Counter;

  public constructor() {
    super()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    this.counter = this.$store.getters['persistent/counterByHash'](
      new Date(this.$route.params.date),
      this.$route.params.hash
    )
  }

  @Watch('counter', {deep: true})
  updateCounterData(): void {
    void this.$store.dispatch('persistent/updateDateCounter', {
      counter: this.counter,
      hash: this.$route.params.hash,
      date: new Date(this.$route.params.date)
    })
  }
};
</script>
