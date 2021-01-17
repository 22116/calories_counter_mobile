<template>
  <state-counter
    title='Edit counter?'
    :counter='counter'
    :show='true'
    @success="(value) => $emit('success', value)"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {Counter} from 'src/store/persistent/counters-models'
import StateCounter from 'components/modals/counter/StateCounter.vue'

@Component({
  components: { StateCounter }
})
export default class EditCounter extends Vue {
  @Prop({type: Object, required: true}) public readonly counter!: Counter
}
</script>
