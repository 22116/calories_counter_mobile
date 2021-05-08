<template>
  <q-dialog v-model="prompt" persistent>
    <q-card class='overflow-hidden-x' style="min-width: 300px">
      <q-carousel v-model='sliderIndex' animated swipeable height='auto' transition-prev="slide-right" transition-next="slide-left">
        <q-carousel-slide :name="0">
          <q-card-section>
            <div class="text-h6">{{ title }}</div>
          </q-card-section>
          <generic v-model='counter' />
        </q-carousel-slide>
        <q-carousel-slide :name="1">
          <q-card-section>
            <div class="text-h6">{{ $t('modals.counter.choose-type') }}</div>
          </q-card-section>
          <type v-model='counter' @input='onCounterChanged' />
        </q-carousel-slide>
        <q-carousel-slide :name="2">
          <q-card-section>
            <div class="text-h6">{{ $t('modals.counter.when-reset') }}</div>
          </q-card-section>
          <q-option-group v-model="counter.timeouts" :options="timeoutOptions" type="checkbox" />
        </q-carousel-slide>
        <q-carousel-slide :name="3">
          <q-card-section class='overflow-hidden-x'>
            <q-card-section>
              <div class="text-h6">{{ $t('modals.counter.preview') }}</div>
            </q-card-section>
            <counter-view
              :key='counterPreviewKey'
              v-model='counterPreview'
              @input='counterPreviewKey++'
              tag='div'
              style='min-height: 400px'
            />
          </q-card-section>
        </q-carousel-slide>
      </q-carousel>
      <q-card-actions align="right" class="text-primary">
        <q-btn v-if='sliderIndex > 0' flat :label="$t('general.previous')" @click='sliderIndex--' />
        <q-btn flat :label="$t('general.cancel')" @click="$emit('cancel')" v-close-popup />
        <q-btn flat :label="sliderIndex === 3 ? $t('general.confirm') : $t('general.next')" @click="onButtonClicked" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Component, Prop, PropSync, VModel, Vue, Watch } from 'vue-property-decorator'
import Generic from 'components/modals/counter/decorators/Generic.vue'
import Type from 'components/modals/counter/decorators/Type.vue'
import { Counter, Score, TimeoutList } from 'src/core/entities/counter'
import CounterView from 'components/view/CounterView.vue'
import { cloneDeep } from 'lodash'

@Component({
  components: { CounterView, Type, Generic }
})
export default class StateCounter extends Vue {
  @Prop({type: String, required: true}) public readonly title!: string
  @VModel({type: Object, required: true}) public counter!: Counter<Score>
  @PropSync('show', {type: Boolean, default: false}) public prompt!: boolean

  public sliderIndex = 0
  public counterPreview = {}
  public counterPreviewKey = 0

  get timeoutOptions(): Array<any> {
    const options = []

    for (const value in TimeoutList) {
      options.push(value)
    }

    return options.map((timeout) => {
      return {
        label: this.$t('general.calendar.' + timeout.toLowerCase()),
        value: timeout.toLowerCase()
      }
    })
  }

  @Watch('counter', {deep: true, immediate: true})
  onCounterChanged(counter: Counter<Score>) {
    this.counterPreview = cloneDeep(counter)
    this.counterPreviewKey++
  }

  onButtonClicked() {
    if (this.sliderIndex === 3) {
      this.prompt = false
      this.$emit('success', this.counter)
      this.sliderIndex = 0
    } else {
      this.sliderIndex++
    }
  }
}
</script>
