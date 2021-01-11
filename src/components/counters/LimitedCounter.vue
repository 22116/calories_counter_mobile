<template>
  <div>
    <q-circular-progress
      show-value
      font-size="32px"
      :value="counterSync.current"
      :max="counterSync.limit"
      size="300px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="row justify-center q-ma-md"
    >
      <span :class="{'text-red': counterSync.current > counterSync.limit}">
        {{ counterSync.current }}/{{ counterSync.limit }}
      </span>
    </q-circular-progress>
    <div class="row q-mt-xl">
      <add-button class="col flex justify-center" :label="'Add'" @success="add" />
      <confirm class="col flex justify-center" :label="'Reset'" :question="'Are you sure you want to reset?'" @success="reset" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'vue-property-decorator';
import AddButton from 'components/helpers/modals/AddButton.vue';
import Confirm from 'components/helpers/modals/Confirm.vue';
import { LimitedCounter as LimitedCounterType } from 'src/store/persistent/counters-models';

@Component({
  components: { Confirm, AddButton }
})
export default class LimitedCounter extends Vue {
  @PropSync('counter', { type: Object, required: true }) public counterSync!: LimitedCounterType;

  add(current: number) {
    this.counterSync.current += current;
    this.$emit('update:counter', this.counterSync);
  }

  reset() {
    this.counterSync.current = 0;
    this.$emit('update:counter', this.counterSync);
  }
}
</script>
