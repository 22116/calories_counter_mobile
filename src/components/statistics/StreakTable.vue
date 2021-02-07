<template>
  <div>
    <template v-if='data.length'>
      <q-table
        title="Streaks"
        dense
        :data="data"
        :columns="columns"
        row-key="name"
      />
    </template>
    <template v-else>
      <q-item>
        <q-item-section>
          No streak data available yet
        </q-item-section>
      </q-item>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, VModel } from 'vue-property-decorator'
import { formatEnum } from 'src/utility/helper'
import { CounterType } from 'src/core/entities/counter'
import { History } from 'src/core/entities'

type Option = {
  counter: string,
  type: string,
  createdAt: string,
  streak: number,
  daysAgo: number,
};

@Component
export default class StreakTable extends Vue {
  @VModel({type: Array, required: true}) public history!: Array<History>
  public columns = [
    { name: 'Counter', align: 'left', label: 'Counter', field: 'counter', sortable: true },
    { name: 'Type', align: 'center', label: 'Type', field: 'type', sortable: true },
    { name: 'Created Date', align: 'center', label: 'Created Date', field: 'createdAt', sortable: true },
    { name: 'Streak', align: 'center', label: 'Streak', field: 'streak', sortable: true },
    { name: 'Days Ago', align: 'center', label: 'Days Ago', field: 'daysAgo', sortable: true },
  ]
  public data: Array<Option> = []

  constructor() {
    super()

    this.$q.loading.show()
  }

  async mounted() {
    const streaks: Record<string, {
      maxStreak: number,
      curStreak: number,
      prev: History,
      first: History,
      date: Date,
    }> = {}
    const history = this.history.sort((a, b) => a.date.toDateString() > b.date.toDateString() ? 1 : -1)

    for (const row of history) {
      if (!streaks[row.counter_id]) {
        row.date.setDate(row.date.getDate() + 1)

        // @ts-ignore
        streaks[row.counter_id] = {}
        streaks[row.counter_id].maxStreak = 1
        streaks[row.counter_id].curStreak = 1
        streaks[row.counter_id].prev = row
        streaks[row.counter_id].first = row
      } else if (streaks[row.counter_id]?.prev.date.toDateString() === row.date.toDateString()) {
        streaks[row.counter_id].curStreak++
      } else {
        streaks[row.counter_id].curStreak = 1
      }

      if (streaks[row.counter_id].curStreak > streaks[row.counter_id].maxStreak) {
        streaks[row.counter_id].maxStreak = streaks[row.counter_id].curStreak
      }

      streaks[row.counter_id].date = row.date
    }

    for (const id in streaks) {
      const counter = await this.$orm.repository.counter.find(id)

      if (!counter) {
        continue
      }

      this.data.push({
        counter: counter.name,
        type: formatEnum(CounterType)[counter.type],
        createdAt: counter.createdAt.toDateString(),
        streak: streaks[id].maxStreak,
        daysAgo: (new Date().getTime() - streaks[id].first.date.getTime()) / 1000 / 60 / 60 / 24
      })
    }

    this.$q.loading.hide()
  }
};
</script>
