<template>
  <state-counter
    :title='$t("modals.counter.edit.title")'
    v-model='counter'
    :show='true'
    @success="(value) => $emit('success', value)"
    @cancel="(value) => $emit('cancel', value)"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Counter, Score } from 'src/core/entities/counter'
import StateCounter from 'components/modals/counter/StateCounter.vue'

@Component({
  components: { StateCounter }
})
export default class EditCounter extends Vue {
  @Prop({type: Object, required: true}) public readonly counter!: Counter<Score>
}
</script>
