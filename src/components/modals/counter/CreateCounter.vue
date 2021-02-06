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
import { BinaryCounterScore, BinaryCounterTheme, Counter, CounterType } from 'src/core/entities/counter'
import StateCounter from 'components/modals/counter/StateCounter.vue'
import { IdGenerator } from 'src/utility/encryption'

@Component({
  components: { StateCounter }
})
export default class CreateCounter extends Vue {
  public prompt = false;
  public counter!: Counter<BinaryCounterScore>;

  constructor(props) {
    super(props)

    this.counter = new Counter()
    this.counter.id = new IdGenerator().generate()
    this.counter.name = ''
    this.counter.description = ''
    this.counter.type = CounterType.Binary
    this.counter.theme = BinaryCounterTheme.Default
    this.counter.icon = 'label'
    this.counter.createdAt = new Date()
    this.counter.enabled = true
    this.counter.scores = {
      value: false,
    }
  }
}
</script>
