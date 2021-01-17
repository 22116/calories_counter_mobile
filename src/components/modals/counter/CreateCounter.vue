<template>
  <q-btn label="Create counter" color="primary" icon-right="add_task" @click="prompt = true">
    <state-counter
      title='Which counter you would like to create?'
      :counter='counter'
      :show='prompt'
      @success="$emit('success', counter)"
      @update:show='(value) => prompt = value'
    />
  </q-btn>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import { BinaryCounterTheme, Counter, CounterType } from 'src/core/models/counter'
import StateCounter from 'components/modals/counter/StateCounter.vue'

@Component({
  components: { StateCounter }
})
export default class CreateCounter extends Vue {
  public prompt = false;
  public counter: Counter = {
    name: '',
    description: '',
    type: CounterType.Binary,
    theme: BinaryCounterTheme.Default,
    icon: 'label',
    value: false,
    createdAt: new Date().toDateString()
  };
}
</script>
