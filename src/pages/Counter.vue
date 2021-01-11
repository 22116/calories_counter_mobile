<template>
  <q-page class="row items-center justify-evenly">
    <limited-counter v-if="isLimitedCounter" :counter="counter" @update:counter="updateCounterData"></limited-counter>
    <binary-counter v-if="isBinaryCounter" :counter="counter" @update:counter="updateCounterData"></binary-counter>
  </q-page>
</template>

<script lang="ts">
import LimitedCounter from 'components/counters/LimitedCounter.vue';
import { Component, Vue } from 'vue-property-decorator';
import { Counter, CounterType } from 'src/store/persistent/counters-models';
import BinaryCounter from 'components/counters/BinaryCounter.vue';

@Component({
  components: { BinaryCounter, LimitedCounter }
})
export default class PageIndex extends Vue {
  public counter!: Counter;

  public constructor() {
    super();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    this.counter = this.$store.getters['persistent/counterByHash'](
      new Date(this.$route.params.date),
      this.$route.params.hash
    );
  }

  updateCounterData(counter: Counter): void {
    this.counter = counter;

    void this.$store.dispatch('persistent/updateDateCounter', {
      value: this.counter,
      hash: this.$route.params.hash,
      date: new Date(this.$route.params.date)
    });
  }

  get isLimitedCounter(): boolean {
    return this.counter.type === CounterType.Limited;
  }

  get isBinaryCounter(): boolean {
    return this.counter.type === CounterType.Binary;
  }
};
</script>
