<template>
  <div>
    <q-card-section class="q-pt-none">
      <q-select v-model="type" :options="types" label="Type">
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
            <q-item-section>
              <q-item-label v-html="scope.opt.label" />
              <q-item-label v-text='getDescription(scope.opt.value)' caption />
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-card-section>

    <q-card-section v-if="isLimitedCounter(counter)" class="q-pt-none">
      <q-input v-model.number="additionalProperties.limit" min="0" label="Limit" />
      <q-input v-model.number="additionalProperties.current" min="0" label="Default" />
    </q-card-section>

    <q-card-section v-if="isGoalCounter(counter)" class="q-pt-none">
      <q-input v-model.number="additionalProperties.current" min="0" label="Goal" />
    </q-card-section>

    <q-card-section v-if="isBinaryCounter(counter)" class="q-pt-none">
      <q-select v-model="theme" :options="binaryThemes" label="Theme" />
    </q-card-section>
  </div>
</template>

<script lang="ts">
import { Component, Emit, VModel, Watch } from 'vue-property-decorator'
import { BinaryCounterTheme, Counter, CounterType } from 'src/core/models/counter'
import { setType } from 'src/core/methods/counter'
import { getCounterTypeDescription } from 'src/core/methods/counter'
import { formatEnum } from 'src/utility/helper'
import CounterTypeMixin from 'components/mixins/CounterTypeMixin'
import CounterView from 'components/CounterView.vue'

type Option = { label: string, value: number }
type AdditionalProperties = { current: number, limit: number, start: number }

const defaultOption: Option = { label: 'Unknown', value: 0 }

@Component({
  components: { CounterView }
})
export default class Type extends CounterTypeMixin {
  @VModel({type: Object, required: true}) public counter!: Counter

  public type: Option = defaultOption
  public theme: Option = defaultOption

  public additionalProperties: AdditionalProperties = {
    current: 100,
    limit: 100,
    start: 100,
  }

  mounted() {
    this.type = {
      label: formatEnum(CounterType)[this.counter.type],
      value: this.counter.type,
    }

    this.theme = {
      label: formatEnum(BinaryCounterTheme)[this.counter.theme],
      value: this.counter.theme,
    }

    if (this.counter.hasOwnProperty('start')) {
      this.additionalProperties.start = this.counter.start as number
    }

    if (this.counter.hasOwnProperty('limit')) {
      this.additionalProperties.limit = this.counter.limit as number
    }

    if (this.counter.hasOwnProperty('current')) {
      this.additionalProperties.current = this.counter.current as number
    }
  }

  get types() {
    return formatEnum(CounterType).map((label, value) => Object.create({ label, value }) as Option)
  }

  get binaryThemes() {
    return formatEnum(BinaryCounterTheme).map((label, value) => Object.create({ label, value }) as Option)
  }

  getDescription(type: CounterType): string {
    return getCounterTypeDescription(type)
  }

  @Emit('input')
  @Watch('additionalProperties', {deep: true})
  additionalPropertiesChanged(props: AdditionalProperties) {
    if (this.isLimitedCounter(this.counter)) {
      this.counter.limit = props.limit
      this.counter.current = props.current
    }

    if (this.isGoalCounter(this.counter)) {
      this.counter.start = props.current
      this.counter.current = props.current
    }

    return this.counter
  }

  @Watch('type')
  onTypeChanged(typeData: {value: CounterType}) {
    setType(this.counter, typeData.value)
  }

  @Watch('theme')
  onThemeChanged(themeData: {value: number}) {
    this.counter.theme = themeData.value
  }
}
</script>
