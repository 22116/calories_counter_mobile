<template>
  <div class='content-center justify-center row'>
    <q-circular-progress
      show-value
      font-size="32px"
      :value="0"
      :max="counterSync.current"
      size="300px"
      :thickness="0.22"
      :color="completed ? 'green' : 'orange'"
      track-color="orange"
      class="col-auto justify-center"
    >
      <span v-if="!completed">
        {{ counterSync.current }} left
      </span>
      <span v-else>
        Passed!
      </span>
    </q-circular-progress>
    <div class="col-12 q-mt-xl">
      <div class='row'>
        <add-button class="col flex" :class='{"justify-end": !completed, "justify-center": completed }' label="Back" @success="back" />
        <add-button v-if="!completed" class="col flex justify-start q-mx-md" label="Forward" @success="forward" />
        <div v-if="!completed" class='col-12 row q-mt-md justify-center'>
          <q-btn class='col-auto q-ma-sm' label="+1" size="xl" color="primary" @click="forward(1)" />
          <q-btn class='col-auto q-ma-sm' label="+5" size="xl" color="primary" @click="forward(5)" />
          <q-btn class='col-auto q-ma-sm' label="+10" size="xl" color="primary" @click="forward(10)" />
          <q-btn class='col-auto q-ma-sm' label="+25" size="xl" color="primary" @click="forward(25)" />
          <q-btn class='col-auto q-ma-sm' label="+50" size="xl" color="primary" @click="forward(50)" />
          <q-btn class='col-auto q-ma-sm' label="+100" size="xl" color="primary" @click="forward(100)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Emit } from 'vue-property-decorator'
import AddButton from 'components/helpers/modals/AddButton.vue'
import Confirm from 'components/helpers/modals/Confirm.vue'
import { GoalCounter as Type } from 'src/core/models/counter'

@Component({
  components: { Confirm, AddButton }
})
export default class GoalCounter extends Vue {
  @PropSync('counter', { type: Object, required: true }) public counterSync!: Type
  public completed = false

  mounted() {
    this.completed = this.counterSync.current === 0
  }

  @Emit('update:counter')
  forward(current: number) {
    if (this.counterSync.current <= current) {
      this.counterSync.current = 0
      this.completed = true

      this.$q.notify({
        type: 'positive',
        message: 'Goal is done for today. Great job!'
      })
    } else {
      this.counterSync.current -= current
    }

    return this.counterSync
  }

  @Emit('update:counter')
  back(current: number) {
    if (current > 0) this.completed = false
    this.counterSync.current += current

    return this.counterSync
  }
}
</script>
