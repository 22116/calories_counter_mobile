<template>
  <q-dialog v-model="show">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Pick counter to switch</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-select v-model="counterOption" :options="counterOptions" label="Type">
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
              :class='scope.opt.class'
            >
              <q-item-section v-if="scope.opt.icon" avatar>
                <q-icon :name="scope.opt.icon" />
              </q-item-section>

              <q-item-section>
                <q-item-label v-html="scope.opt.label" />
                <q-item-label
                  v-text='scope.opt.description'
                  caption
                />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Ok" @click="switchCounter" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, VModel, Vue, Watch } from 'vue-property-decorator'
import {Counter} from 'src/core/models/counter'
import StateCounter from 'components/modals/counter/StateCounter.vue'
import { isSucceed } from 'src/core/methods/counter'
import { Hash } from 'src/store/persistent/state'

type Option = {
  value: string,
  label: string,
  description: string,
  icon: string,
  class: Record<string, boolean>,
}

@Component({
  components: { StateCounter }
})
export default class SwitchCounter extends Vue {
  @VModel({type: Boolean, required: true}) public readonly show!: boolean
  @Prop({type: Object, required: true}) public readonly counters!: Record<Hash, Counter>
  public counterOption: Option|null = null
  public counterOptions: Array<Option> = []

  @Watch('counters', {deep: true})
  public onCountersChanged() {
    this.counterOptions = []

    for (const hash in this.counters) {
      const succeed = isSucceed(this.counters[hash])

      this.counterOptions.push({
        value: hash,
        label: this.counters[hash].name,
        description: this.counters[hash].description,
        icon: this.counters[hash].icon || '',
        class: {
          'bg-green-transparent': succeed,
          'bg-red-transparent': !succeed,
        }
      })
    }
  }

  @Emit('picked')
  public switchCounter() {
    return this.counterOption?.value
  }
}
</script>