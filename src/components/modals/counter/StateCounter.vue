<template>
  <q-dialog v-model="prompt" persistent>
    <q-card class='overflow-hidden-x' style="min-width: 400px">
      <q-carousel v-model='sliderIndex'
                  animated
                  swipeable
                  height='auto'
                  transition-prev="slide-right"
                  transition-next="slide-left"
      >
        <q-carousel-slide :name="0">
          <q-card-section>
            <div class="text-h6">{{ title }}</div>
          </q-card-section>
          <generic v-model='counter' />
        </q-carousel-slide>
        <q-carousel-slide :name="1">
          <q-card-section>
            <div class="text-h6">Choose counter style</div>
          </q-card-section>
          <type v-model='counter' />
        </q-carousel-slide>
        <q-carousel-slide :name="2">
          <q-card-section class='overflow-hidden-x'>
            <q-card-section>
              <div class="text-h6">Counter preview</div>
            </q-card-section>
            <counter-view v-model='counterPreview' @input='() => {}' tag='div' style='min-height: 400px' />
          </q-card-section>
        </q-carousel-slide>
      </q-carousel>
      <q-card-actions align="right" class="text-primary">
        <q-btn v-if='sliderIndex > 0' flat label="Previous" @click='sliderIndex--' />
        <q-btn flat label="Cancel" @click="$emit('cancel')" v-close-popup />
        <q-btn flat :label="sliderIndex === 2 ? 'Confirm' : 'Next'" @click="onButtonClicked" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Component, Prop, PropSync, VModel, Vue } from 'vue-property-decorator'
import Generic from 'components/modals/counter/decorators/Generic.vue'
import Type from 'components/modals/counter/decorators/Type.vue'
import { Counter } from 'src/core/models/counter'
import CounterView from 'components/CounterView.vue'
import { clone } from 'src/utility/helper'

@Component({
  components: { CounterView, Type, Generic }
})
export default class StateCounter extends Vue {
  @Prop({type: String, required: true}) public readonly title!: string
  @VModel({type: Object, required: true}) public counter!: Counter
  @PropSync('show', {type: Boolean, default: false}) public prompt!: boolean

  public sliderIndex = 0

  get counterPreview() {
    return clone(this.counter)
  }

  set counterPreview(_value: Counter) {
    // No actions required
  }

  onButtonClicked() {
    if (this.sliderIndex === 2) {
      this.prompt = false
      this.$emit('success', this.counter)
    } else {
      this.sliderIndex++
    }
  }
}
</script>
