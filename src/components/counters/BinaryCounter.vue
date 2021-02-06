<template>
  <div class="row full-width justify-center">
    <q-toggle v-if='isDefault()' size="150px" v-model="counterSync.scores.value" :color="counterSync.scores.value ? 'green' : 'red'" />
    <bear-toggle v-if='isBear()' v-model='counterSync.scores.value' />
    <colorful-toggle v-if='isColorful()' v-model='counterSync.scores.value' />
  </div>
</template>

<script lang="ts">
import { Component, Emit, PropSync, Vue, Watch } from 'vue-property-decorator'
import BearToggle from 'components/helpers/buttons/BearToggle.vue'
import ColorfulToggle from 'components/helpers/buttons/ColorfulToggle.vue'
import { Counter } from 'src/core/entities'
import { BinaryCounterScore, BinaryCounterTheme } from 'src/core/entities/Counter'

@Component({
  components: { ColorfulToggle, BearToggle }
})
export default class BinaryCounter extends Vue {
  @PropSync('counter', { type: Object, required: true })
  public counterSync!: Counter<BinaryCounterScore>;

  @Watch('counterSync.score.value')
  @Emit('update:counter')
  public counterUpdated() {
    return this.counterSync
  }

  public isDefault(): boolean {
    return this.counterSync.theme === BinaryCounterTheme.Default
  }

  public isBear(): boolean {
    return this.counterSync.theme === BinaryCounterTheme.Bear
  }

  public isColorful(): boolean {
    return this.counterSync.theme === BinaryCounterTheme.Colorful
  }
}
</script>
