<template>
  <q-btn label="Create counter" color="primary" icon-right="add_task" @click="prompt = true">
    <state-counter
      title='Which counter you would like to create?'
      v-model='counter'
      :show='prompt'
      @success="$emit('success', counter)"
      @update:show='(value) => prompt = value'
    />
  </q-btn>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { BinaryCounterScore, Counter } from 'src/core/entities/counter'
import StateCounter from 'components/modals/counter/StateCounter.vue'
import { CounterService } from 'src/core/services/CounterService'

@Component({
  components: { StateCounter }
})
export default class CreateCounter extends Vue {
  public prompt = false;
  public counter!: Counter<BinaryCounterScore>;

  constructor() {
    super()

    this.counter = this.$container.resolve(CounterService).create() as Counter<BinaryCounterScore>
  }
}
</script>
