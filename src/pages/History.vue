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

          <q-card-section class="q-pt-none">
            <q-select v-model="counterOption" :options="counterOptions" label="Type">
              <template v-slot:option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section v-if="scope.opt.icon" avatar>
                    <q-icon :name="scope.opt.icon" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label v-html="scope.opt.label" />
                    <q-item-label
                      v-text='scope.opt.description'
                      caption
                    />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Ok" @click="switchCounter" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <div class="row q-gutter-md q-pa-lg">
      <q-badge color="red">Some of the counters are not passed</q-badge>
      <q-badge color="green">All counters reached</q-badge>
    </div>
    <div class="row q-gutter-md q-pa-lg text-grey">
      Help: Tap on the day to switch on the counter in the past. You can
      switch to the date where you already have registered counter.
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { dateFormat } from 'src/utility/helper'
import { History } from 'src/store/persistent/state'
import { CounterType } from 'src/core/models/counter'

type Option = {label: string, value: string, description: string, icon: string|null};

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
    super()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    this.history = this.$store.getters['persistent/history']
    this.events = Object.keys(this.history).map((date: string) => dateFormat(new Date(date), this.FORMAT))
  }

  public eventColor(date: string): string {
    const day = this.history[new Date(date).toDateString()]

    for (let hash in day.counters) {
      const counter = day.counters[hash]

      switch (counter.type) {
        case CounterType.Binary: if (!counter.value) return 'red'; continue
        case CounterType.Limited: if ((counter.current as number) > (counter.limit as number)) return 'red'; continue
        case CounterType.Goal: if (counter.current) return 'red'
      }
    }

    return 'green'
  }

  @Watch('date')
  public dateChanged(date: string|null) {
    const today = new Date().toDateString()

    if (date !== null && new Date(date).toDateString() !== today && this.history[new Date(date).toDateString()]) {
      const counters = this.history[new Date(date).toDateString()].counters
      this.counterOptions = []

      for (let hash in counters) {
        this.counterOptions.push({
          value: hash,
          label: counters[hash].name,
          description: counters[hash].description,
          icon: counters[hash].icon,
        })
      }

      this.prompt = true
    }
  }

  public async switchCounter() {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    await this.$router.push(`/counter/${this.counterOption?.value}/${new Date(this.date).toDateString()}`)
  }
};
</script>

<style lang="sass">
#calendar
  min-height: 50vh
</style>
