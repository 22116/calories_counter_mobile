<template>
  <q-dialog v-model="prompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input v-model.trim="counterSync.name" label="Name" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input v-model.trim="counterSync.description" label="Description" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-select v-model="counterSync.icon" :options="icons">
          <template v-slot:append>
            <q-avatar>
              <q-icon :name="counterSync.icon" />
            </q-avatar>
          </template>
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
            >
              <q-item-section avatar>
                <q-icon :name="scope.opt" />
              </q-item-section>
              <q-item-section>
                <q-item-label v-html="scope.opt" />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-select v-model="type" :options="types" label="Type" />
      </q-card-section>

      <q-card-section v-if="isLimitedType" class="q-pt-none">
        <q-input v-model.number="counterSync.limit" min="0" label="Limit" />
        <q-input v-model.number="counterSync.current" min="0" label="Default" />
      </q-card-section>

      <q-card-section v-if="isGoalType" class="q-pt-none">
        <q-input v-model.number="counterSync.current" min="0" label="Goal" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Add" @click="$emit('success', counterSync)" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'
import {Counter, CounterType} from 'src/store/persistent/counters-models'
import { setType } from 'src/core/methods/counter'

@Component
export default class StateCounter extends Vue {
  @Prop({type: String, required: true}) public title!: string
  @PropSync('counter', {type: Object, required: true}) public counterSync!: Counter
  @PropSync('show', {type: Boolean, default: false}) public prompt!: boolean

  public type = {
    label: 'Binary',
    value: CounterType.Binary,
  }
  public icons = [
    'label',
    'help',
    'gavel',
    'grade',
    'mediation',
    'offline_bolt',
    'preview',
    'reorder',
    'source',
    'touch_app',
    'visibility',
    'error',
    'loop',
    'movie',
    'web',
    'call',
    'calculate',
  ]

  get types() {
    const data = Object.values(CounterType)
    const values = data.slice(data.length / 2, data.length)
    const keys = data.slice(0, data.length / 2)

    return values.map((value, index) => {
      return {
        label: keys[index],
        value,
      }
    })
  }

  get isLimitedType(): boolean {
    return this.counterSync.type == CounterType.Limited
  }

  get isGoalType(): boolean {
    return this.counterSync.type == CounterType.Goal
  }

  @Watch('type')
  onTypeChanged(typeData: {value: number}) {
    setType(this.counterSync, typeData.value)
  }
}
</script>
