<template>
  <div>
    <template v-if='data.length'>
      <q-table
        grid
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
import { Vue, Component, VModel,  } from 'vue-property-decorator'
import { formatEnum } from 'src/utility/helper'
import { CounterType } from 'src/core/entities/counter'
import { History } from 'src/core/entities'
import { CounterService } from 'src/core/services/CounterService'
import { cloneDeep } from 'lodash'
import { InMemory } from 'src/utility/database/proxy/InMemory'

type Option = {
  counter: string,
  type: string,
  createdAt: string,
  maxStreak: number,
  curStreak: number,
};

@Component
export default class StreakTable extends Vue {
  @VModel({type: Array, required: true}) public history!: Array<History>
  public columns = [
    { name: 'Counter', align: 'left', label: 'Counter', field: 'counter', sortable: true },
    { name: 'Type', align: 'center', label: 'Type', field: 'type', sortable: true },
    { name: 'Created Date', align: 'center', label: 'Created Date', field: 'createdAt', sortable: true },
    { name: 'MaxStreak', align: 'center', label: 'Maximum Streak', field: 'maxStreak', sortable: true },
    { name: 'CurStreak', align: 'center', label: 'Current Streak', field: 'curStreak', sortable: true },
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
    }> = {}
    const history = cloneDeep(this.history).sort((a, b) => a.date.getTime() > b.date.getTime() ? 1 : -1)

    for (const row of history) {
      if (!streaks[row.counter_id]) {
        streaks[row.counter_id] = {
          maxStreak: 1,
          curStreak: 1,
          prev: row,
          first: row,
        }
      }

      if (
        streaks[row.counter_id]?.prev.date.toISOString() === row.date.toISOString() &&
        this.$container.resolve(CounterService).isSucceed(row.getCounter())
      ) {
        streaks[row.counter_id].curStreak++
      } else {
        streaks[row.counter_id].curStreak = 1
        streaks[row.counter_id].prev = row
        streaks[row.counter_id].first = row
      }

      if (streaks[row.counter_id].curStreak > streaks[row.counter_id].maxStreak) {
        streaks[row.counter_id].maxStreak = streaks[row.counter_id].curStreak
      }

      streaks[row.counter_id].prev = row

      row.date.setDate(row.date.getDate() + 1)
    }

    for (const id in streaks) {
      const counter = await this.$orm.repository.counter.setProxy(new InMemory(id)).find(id)

      if (!counter) {
        continue
      }

      this.data.push({
        counter: counter.name,
        type: formatEnum(CounterType)[counter.type],
        createdAt: counter.createdAt.toDateString(),
        maxStreak: streaks[id].maxStreak - 1,
        curStreak: streaks[id].curStreak - 1,
      })
    }

    this.$q.loading.hide()
  }
};
</script>
