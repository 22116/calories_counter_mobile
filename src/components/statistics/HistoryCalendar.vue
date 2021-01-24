<template>
  <div class='q-mt-sm'>
    <q-date
      v-model="date"
      :events="events"
      :event-color="eventColor"
      class="full-width"
      id="calendar"
    />
    <switch-counter v-model='prompt' :counters='counters' @picked='switchCounter' />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import { dateFormat } from 'src/utility/helper'
import { Hash, History } from 'src/store/persistent/state'
import { isSucceed } from 'src/core/methods/counter'
import SwitchCounter from 'components/modals/counter/SwitchCounter.vue'
import { Counter } from 'src/core/models/counter'

type Option = {label: string, value: string, description: string, icon: string|null, class: Record<string, boolean>};

@Component({
  components: { SwitchCounter },
  filters: { dateFormat }
})
export default class HistoryCalendar extends Vue {
  public readonly FORMAT = 'yyyy/MM/dd'

  @Prop({type: Object, required: true}) public history!: History
  @Prop({type: Array, default: []}) public whiteListHashes!: Array<Hash>

  public prompt = false
  public date = dateFormat(new Date(), this.FORMAT)
  public events: Array<string> = []
  public counters: Record<Hash, Counter> = {}

  mounted() {
    this.events = Object.keys(this.history).map((date: string) => dateFormat(new Date(date), this.FORMAT))
  }

  eventColor(date: string): string {
    const day = this.history[new Date(date).toDateString()]

    for (let hash in day.counters) {
      if (!this.whiteListHashes.includes(hash)) {
        continue
      }

      const counter = day.counters[hash]

      if (!isSucceed(counter)) {
        return 'red'
      }
    }

    return 'green'
  }

  @Watch('date')
  dateChanged(date: string|null) {
    if (!date) {
      return
    }

    const concrete = new Date(date).toDateString()
    const today = new Date().toDateString()

    if (concrete !== today && this.history[concrete]) {
      this.counters = this.history[concrete].counters
      this.prompt = true
    }
  }

  public async switchCounter(hash: Hash) {
    await this.$router.push(`/counter/${hash}/${new Date(this.date).toDateString()}`)
  }
};
</script>

<style lang="sass">
#calendar
  min-height: 50vh
</style>
