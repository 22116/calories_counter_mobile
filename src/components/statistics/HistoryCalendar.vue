<template>
  <div class='q-mt-sm'>
    <q-date
      v-model="date"
      :events="events"
      :event-color="eventColor"
      class="full-width"
      id="calendar"
      @navigation='navigation'
    />
    <switch-counter v-model='prompt' :counters='counters' @picked='switchCounter' />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Emit } from 'vue-property-decorator'
import SwitchCounter from 'components/modals/counter/SwitchCounter.vue'
import { Counter, Score } from 'src/core/entities/counter'
import { History } from 'src/core/entities'
import { date } from 'quasar'
import formatDate = date.formatDate
import { CounterService } from 'src/core/services/CounterService'

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

  @Emit('navigation')
  navigation<T extends { year: number, month: number }>(view: T): T{
    view.month -= 1

    return view
  }

  @Watch('history', {immediate: true, deep: true})
  historyChanged() {
    this.events = this.history.map((history: History) => formatDate(history.date, this.FORMAT))
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
