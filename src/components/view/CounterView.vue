<template>
  <component :is='tag' class="row items-center justify-evenly items-stretch">
    <limited-counter v-if="isLimitedCounter(counter)" :counter="counter" @update:counter="updateCounterData"></limited-counter>
    <binary-counter v-if="isBinaryCounter(counter)" :counter="counter" @update:counter="updateCounterData"></binary-counter>
    <goal-counter v-if="isGoalCounter(counter)" :counter="counter" @update:counter="updateCounterData"></goal-counter>
  </component>
</template>

<script lang='ts'>
import { Component, Emit, Prop, VModel } from 'vue-property-decorator'
import GoalCounter from '../counters/GoalCounter.vue'
import BinaryCounter from '../counters/BinaryCounter.vue'
import LimitedCounter from '../counters/LimitedCounter.vue'
import CounterTypeMixin from '../mixins/CounterTypeMixin'
import { Counter } from 'src/core/entities'
import { Score } from 'src/core/entities/Counter'

@Component({
  components: {GoalCounter, BinaryCounter, LimitedCounter }
})
export default class CounterView  extends CounterTypeMixin {
  @VModel({type: Object, required: true}) public counter!: Counter<Score>
  @Prop({type: String, default: 'q-page'}) public readonly tag!: string

  @Emit('input')
  updateCounterData(counter: Counter<Score>) {
    return counter
  }
}
</script>
