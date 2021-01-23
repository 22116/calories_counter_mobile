<template>
  <div class='content-center justify-center row'>
    <q-circular-progress
      show-value
      font-size="32px"
      :value="counterSync.current"
      :max="counterSync.limit"
      size="300px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="col-auto justify-center"
    >
      <span :class="{'text-red': counterSync.current > counterSync.limit}">
        {{ counterSync.current }}/{{ counterSync.limit }}
      </span>
    </q-circular-progress>
    <div class="col-12 q-mt-xl">
      <div class='row'>
        <add-button class="col flex justify-end" :label="'Add'" @success="add" />
        <confirm class="col flex justify-start q-mx-md" :label="'Reset'" :question="'Are you sure you want to reset?'" @success="reset" />
        <div class='col-12 row q-mt-md justify-center'>
          <q-btn class='col-auto q-ma-sm' label="+1" size="xl" color="primary" @click="add(1)" />
          <q-btn class='col-auto q-ma-sm' label="+5" size="xl" color="primary" @click="add(5)" />
          <q-btn class='col-auto q-ma-sm' label="+10" size="xl" color="primary" @click="add(10)" />
          <q-btn class='col-auto q-ma-sm' label="+25" size="xl" color="primary" @click="add(25)" />
          <q-btn class='col-auto q-ma-sm' label="+50" size="xl" color="primary" @click="add(50)" />
          <q-btn class='col-auto q-ma-sm' label="+100" size="xl" color="primary" @click="add(100)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Emit } from 'vue-property-decorator'
import AddButton from 'components/helpers/buttons/AddButton.vue'
import Confirm from 'components/helpers/buttons/Confirm.vue'
import { LimitedCounter as LimitedCounterType } from 'src/core/models/counter'

@Component({
  components: { Confirm, AddButton }
})
export default class LimitedCounter extends Vue {
  @PropSync('counter', { type: Object, required: true }) public counterSync!: LimitedCounterType;

  @Emit('update:counter')
  add(current: number) {
    this.counterSync.current += current

    return this.counterSync
  }

  @Emit('update:counter')
  reset() {
    this.counterSync.current = 0

    return this.counterSync
  }
}
</script>
