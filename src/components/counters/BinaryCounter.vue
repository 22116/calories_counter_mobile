<template>
  <div class="q-pa-md">
    <q-toggle size="150px" v-model="counterSync.value" :color="counterSync.value ? 'green' : 'red'" @input="counterUpdated" />
  </div>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator';
import { BinaryCounter as BinaryCounterType } from 'src/store/persistent/counters-models';

@Component
export default class BinaryCounter extends Vue {
  @PropSync('counter', { type: Object, required: true }) public counterSync!: BinaryCounterType;

  counterUpdated() {
    this.$emit('update:counter', this.counterSync);
  }
}
</script>
