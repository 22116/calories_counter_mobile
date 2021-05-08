<template>
  <q-dialog v-model='show'>
    <q-card>
      <q-card-section>
        <template v-if='!!Object.keys(countersOptions).length'>
          <q-item
            v-for='hash in Object.keys(countersOptions)'
            :key='new Date(countersOptions[hash].createdDate).getTime() + hash'
            tag="label"
            v-ripple
          >
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
        </template>
        <template v-else>
          <q-item>
            <q-item-section>
              {{ $t('modals.history.whitelist.empty') }}
            </q-item-section>
          </q-item>
        </template>
      </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn flat :label="$t('general.close')" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, VModel, Vue, Watch } from 'vue-property-decorator'
import { Counter } from 'src/core/entities'
import { Score } from 'src/core/entities/Counter'

type CounterCheckbox = {
  value: boolean,
  icon: string,
  name: string,
  description: string,
  createdDate: string,
}

@Component
export default class Whitelist extends Vue {
  @VModel({type: Boolean, required: true}) public show!: boolean
  @Prop({type: Array, required: true}) public counters!: Array<Counter<Score>>
  public countersOptions: Record<string, CounterCheckbox> = {}

  constructor() {
    super()

    for (const counter of this.counters) {
      this.countersOptions[counter.id] = {
        value: true,
        icon: counter.icon || '',
        name: counter.name,
        description: counter.description,
        createdDate: counter.createdAt.toDateString()
      }
    }
  }

  @Watch('countersOptions', {deep: true, immediate: true})
  @Emit('update')
  whiteListHashes(): Array<string> {
    let hashes = []

    for (const hash in this.countersOptions) {
      if (this.countersOptions[hash].value) {
        hashes.push(hash)
      }
    }

    return hashes
  }
}
</script>
