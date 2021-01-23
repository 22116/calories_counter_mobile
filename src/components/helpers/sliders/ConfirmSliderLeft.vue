<template>
  <div>
    <q-slide-item v-bind='Object.assign($props, $attrs)' @left="onSwipe">
      <!-- Pass on all named slots -->
      <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot"/>

      <!-- Pass on all scoped slots -->
      <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope">
        <slot :name="slot" v-bind="scope"/>
      </template>
    </q-slide-item>
    <confirm v-model='show' :question='question' @success="$emit('success')" @finished='() => resetCallback()' />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import Confirm from 'src/components/helpers/modals/Confirm.vue'

type ResetSlideCallback = () => void

@Component({
  components: {Confirm}
})
export default class ConfirmSliderLeft extends Vue {
  @Prop({type: String, required: true}) public readonly question!: string
  public show = false
  public resetCallback!: ResetSlideCallback

  onSwipe(item: {reset: ResetSlideCallback}) {
    this.resetCallback = item.reset
    this.show = true
  }
}
</script>
