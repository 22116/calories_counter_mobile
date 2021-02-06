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
import { Vue, Component, VModel, Watch } from 'vue-property-decorator'
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

  @Watch('history', {deep: true, immediate: true})
  async updateData() {
    this.data = []

    for (const row of this.history) {
      const counters = await this.$orm.repository.history.findDailyCountersByDate(new Date(row.date))

      for (const counter of counters) {
        this.data.push({
          counter: counter.name,
          type: formatEnum(CounterType)[counter.type],
          createdAt: counter.createdAt.toDateString(),
          streak: 1,
          daysAgo: 1,
        })
      }
    }
  }
};
</script>
