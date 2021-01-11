<template>
  <q-page class="justify-evenly">
    <div class="row q-gutter-md q-pa-lg">
      <q-date
        v-model="date"
        :events="events"
        :event-color="eventColor"
        class="full-width"
        id="calendar"
      />
      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Pick counter to switch</div>
          </q-card-section>

          <q-card-section>
            <q-select v-model="counterOption" :options="counterOptions" />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Ok" @click="switchCounter" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <div class="row q-gutter-md q-pa-lg">
      <q-badge color="red">Binary counter uncheched</q-badge>
      <q-badge color="green">Binary counter cheched</q-badge>
    </div>
    <div class="row q-gutter-md q-pa-lg text-grey">
      Help: Tap on the day to switch on the counter in the past
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { dateFormat } from 'src/other/helper';
import { History } from 'src/store/persistent/state';
import { CounterType } from 'src/store/persistent/counters-models';

type Option = {label: string, value: string};

@Component({
  filters: { dateFormat }
})
export default class PageHistory extends Vue {
  public readonly FORMAT = 'yyyy/MM/dd';

  public prompt = false;
  public date = dateFormat(new Date(), this.FORMAT);
  public events: Array<string> = [];
  public history: History;
  public counterOption: Option|null = null;
  public counterOptions: Array<Option> = [];

  public constructor() {
    super();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    this.history = this.$store.getters['persistent/history'];
    this.events = Object.keys(this.history).map((date: string) => dateFormat(new Date(date), this.FORMAT))
  }

  public eventColor(date: string): string {
    const day = this.history[new Date(date).toDateString()];

    for (let hash in day.counters) {
      if (day.counters[hash].type === CounterType.Binary && !day.counters[hash].value) {
        return 'red';
      }
    }

    return 'green';
  }

  @Watch('date')
  public dateChanged(date: string|null) {
    const today = new Date().toDateString();

    if (date !== null && new Date(date).toDateString() !== today && this.history[new Date(date).toDateString()]) {
      const counters = this.history[new Date(date).toDateString()].counters;
      this.counterOptions = [];

      for (let hash in counters) {
        this.counterOptions.push({
          value: hash,
          label: counters[hash].name,
        })
      }

      this.prompt = true;
    }
  }

  public switchCounter() {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    void this.$router.push(`/counter/${this.counterOption?.value}/${new Date(this.date).toDateString()}`)
  }
};
</script>

<style lang="sass">
#calendar
  min-height: 50vh
</style>
