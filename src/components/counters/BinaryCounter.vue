<template>
  <div class="row full-width justify-center">
    <q-toggle v-if='isDefault()' size="150px" v-model="counterSync.value" :color="counterSync.value ? 'green' : 'red'" />
    <bear-toggle v-if='isBear()' v-model='counterSync.value' />
    <colorful-toggle v-if='isColorful()' v-model='counterSync.value' />
  </div>
</template>

<script lang="ts">
import { Component, Emit, PropSync, Vue, Watch } from 'vue-property-decorator'
import { BinaryCounter as BinaryCounterType, BinaryCounterTheme } from 'src/core/models/counter'
import BearToggle from 'components/helpers/buttons/BearToggle.vue'
import ColorfulToggle from 'components/helpers/buttons/ColorfulToggle.vue'

@Component({
  components: { ColorfulToggle, BearToggle }
})
export default class BinaryCounter extends Vue {
  @PropSync('counter', { type: Object, required: true }) public counterSync!: BinaryCounterType;

  @Watch('counterSync.value')
  @Emit('update:counter')
  public counterUpdated() {
    return this.counterSync
  }

  public isDefault(): boolean {
    return this.counterSync.theme === undefined || this.counterSync.theme === BinaryCounterTheme.Default
  }

  public isBear(): boolean {
    return this.counterSync.theme === BinaryCounterTheme.Bear
  }

  public isColorful(): boolean {
    return this.counterSync.theme === BinaryCounterTheme.Colorful
  }
}
</script>
