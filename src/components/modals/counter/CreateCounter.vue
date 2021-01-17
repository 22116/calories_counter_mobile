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
import {Counter, CounterType} from 'src/store/persistent/counters-models'
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
    icon: 'label',
    value: false,
    createdAt: new Date().toDateString()
  };
}
</script>
