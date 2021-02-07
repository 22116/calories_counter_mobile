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
import SwitchCounter from 'components/modals/counter/SwitchCounter.vue'
import { Counter, Score } from 'src/core/entities/counter'
import { History } from 'src/core/entities'
import { date } from 'quasar'
import formatDate = date.formatDate
import { CounterService } from 'src/core/services/CounterService'

type Option = {label: string, value: string, description: string, icon: string|null, class: Record<string, boolean>};

@Component({
  components: { SwitchCounter },
})
export default class HistoryCalendar extends Vue {
  public readonly FORMAT = 'YYYY/MM/DD'

  @Prop({type: Array, required: true}) public history!: Array<History>
  @Prop({type: Array, default: []}) public whiteListHashes!: Array<string>

  public prompt = false
  public date = formatDate(new Date(), this.FORMAT)
  public events: Array<string> = []
  public counters: Array<Counter<Score>> = []

  constructor() {
    super()

    this.events = this.history.map((history: History) => formatDate(history.date, this.FORMAT))
  }

  eventColor(date: string): string {
    const history = this.history.filter((history) => formatDate(history.date, this.FORMAT) === date)

    for (const day of history) {
      if (!this.whiteListHashes.includes(day.getCounter().id)) {
        continue
      }

      if (!this.$container.resolve(CounterService).isSucceed(day.getCounter())) {
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

    const concrete = new Date(date).toISOString()
    const today = new Date().toISOString()

    if (concrete !== today && this.history.find((row) => row.date.toISOString() === concrete)) {
      this.counters = this.history
        .filter((history) => formatDate(history.date, this.FORMAT) === date)
        .map((day) => day.getCounter())
      this.prompt = true
    }
  }

  public async switchCounter(hash: string) {
    await this.$router.push(`/counter/${new Date(this.date).toISOString()}/${hash}`)
  }
};
</script>

<style lang="sass">
#calendar
  min-height: 50vh
</style>
