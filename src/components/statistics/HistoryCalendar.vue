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
import { isSucceed } from 'src/core/methods/counter'
import SwitchCounter from 'components/modals/counter/SwitchCounter.vue'
import { Counter, Score } from 'src/core/entities/counter'
import { History } from 'src/core/entities'
import { date } from 'quasar'
import formatDate = date.formatDate

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

  mounted() {
    this.events = this.history.map((history: History) => formatDate(history.date, this.FORMAT))
  }

  async eventColor(date: string): Promise<string> {
    const counters = await this.$orm.repository.history.findDailyCountersByDate(new Date(date))

    for (const counter of counters) {
      if (!this.whiteListHashes.includes(counter.id)) {
        continue
      }

      if (!isSucceed(counter)) {
        return 'red'
      }
    }

    return 'green'
  }

  @Watch('date')
  async dateChanged(date: string|null) {
    if (!date) {
      return
    }

    const concrete = new Date(date).toDateString()
    const today = new Date().toDateString()

    if (concrete !== today && this.history.find((row) => row.date.toDateString() === concrete)) {
      this.counters = await this.$orm.repository.history.findDailyCountersByDate(new Date(date))
      this.prompt = true
    }
  }

  public async switchCounter(hash: string) {
    await this.$router.push(`/counter/${hash}/${new Date(this.date).toDateString()}`)
  }
};
</script>

<style lang="sass">
#calendar
  min-height: 50vh
</style>
