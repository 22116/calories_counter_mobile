<template>
  <q-page class="justify-evenly">
    <history-calendar :history='history' :white-list-hashes='whiteListHashes' class="row q-gutter-md q-pa-lg" />
    <div class="row q-gutter-md q-pa-lg">
      <q-badge color="red">Some of the counters are not passed</q-badge>
      <q-badge color="green">All counters reached</q-badge>
    </div>
    <div class="row q-gutter-md q-pa-lg">
      <q-expansion-item
        class="shadow-1 overflow-hidden full-width"
        style="border-radius: 5px"
        icon="article"
        label="Counters to watch"
        header-class="bg-primary text-white"
        expand-icon-class="text-white"
      >
        <q-card>
          <q-card-section>
            <q-item v-for='hash in Object.keys(countersOptions)' :key='hash' tag="label" v-ripple>
              <q-item-section avatar>
                <q-checkbox v-model="countersOptions[hash].value" />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-icon :name="countersOptions[hash].icon" />
                  {{ countersOptions[hash].name }} ({{ countersOptions[hash].createdDate }})
                </q-item-label>
                <q-item-label caption>{{ countersOptions[hash].description }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>
    <div class="row q-gutter-md q-pa-lg text-grey">
      Help: Tap on the day to switch on the counter in the past. You can
      switch to the date where you already have registered counter.
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { dateFormat } from 'src/utility/helper'
import { Hash, History } from 'src/store/persistent/state'
import HistoryCalendar from 'components/statistics/HistoryCalendar.vue'

type CounterCheckbox = {
  value: boolean,
  icon: string,
  name: string,
  description: string,
  createdDate: string,
}

@Component({
  components: { HistoryCalendar },
  filters: { dateFormat }
})
export default class PageHistory extends Vue {
  public history: History
  public countersOptions: Record<Hash, CounterCheckbox> = {}

  public constructor() {
    super()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    this.history = this.$store.getters['persistent/history']

    for (const date in this.history) {
      const counters = this.history[date].counters

      for (const hash in counters) {
        const counter = counters[hash]

        this.countersOptions[hash] = {
          value: true,
          icon: counter.icon,
          name: counter.name,
          description: counter.description,
          createdDate: counter.createdAt
        }
      }
    }
  }

  get whiteListHashes(): Array<Hash> {
    let hashes = []

    for (const hash in this.countersOptions) {
      if (this.countersOptions[hash].value) {
        hashes.push(hash)
      }
    }

    return hashes
  }
};
</script>
