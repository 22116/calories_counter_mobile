<template>
  <div>
    <q-circular-progress
      show-value
      font-size="32px"
      :value="day.current"
      :max="day.limit"
      size="300px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="row justify-center q-ma-md"
    >
      <span :class="{'text-red': day.current > day.limit}">
        {{ day.current }}/{{ day.limit }}
      </span>
    </q-circular-progress>
    <div class="row q-mt-xl">
      <add-button class="col flex justify-center" :label="'Add'" @success="add" />
      <confirm class="col flex justify-center" :label="'Reset'" :question="'Are you sure you want to reset?'" @success="reset" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { DayData } from 'src/store/calories/state';
import AddButton from 'components/AddButton.vue';
import Confirm from 'components/Confirm.vue';

@Component({
  components: { Confirm, AddButton }
})
export default class Counter extends Vue {
  public day!: DayData;

  constructor() {
    super();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    this.day = Object.assign(this.$store.getters['calories/currentDay']);

    console.log('Current day:', this.day)
  }

  add(current: number) {
    this.day.current += current;
    void this.$store.dispatch('calories/updateCounter', this.day);
  }

  reset() {
    this.day.current = 0;
    void this.$store.dispatch('calories/updateCounter', this.day);
  }
}
</script>
