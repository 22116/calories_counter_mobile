<template>
  <div>
    <p>Limit: {{ current }}/{{ limit }}</p>
    <button @click="add">Add</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ClassComponent extends Vue {
  @Prop({ type: Number, required: true}) readonly limit!: number;

  current = 0;

  add() {
    this.current++;
  }
}
</script>
