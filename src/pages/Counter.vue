<template>
  <q-page class="row items-center justify-evenly items-stretch">
    <limited-counter v-if="isLimitedCounter(counter)" :counter="counter" @update:counter="updateCounterData"></limited-counter>
    <binary-counter v-if="isBinaryCounter(counter)" :counter="counter" @update:counter="updateCounterData"></binary-counter>
    <goal-counter v-if="isGoalCounter(counter)" :counter="counter" @update:counter="updateCounterData"></goal-counter>
  </q-page>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { Counter } from 'src/core/models/counter'
import LimitedCounter from 'components/counters/LimitedCounter.vue'
import BinaryCounter from 'components/counters/BinaryCounter.vue'
import GoalCounter from 'components/counters/GoalCounter.vue'
import CounterTypeMixin from 'components/mixins/CounterTypeMixin'

@Component({
  components: {GoalCounter, BinaryCounter, LimitedCounter }
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

  updateCounterData(counter: Counter): void {
    this.counter = counter

    void this.$store.dispatch('persistent/updateDateCounter', {
      counter: this.counter,
      hash: this.$route.params.hash,
      date: new Date(this.$route.params.date)
    })
  }
};
</script>
