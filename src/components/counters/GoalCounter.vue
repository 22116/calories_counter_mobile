<template>
  <div class='content-center justify-center row'>
    <q-circular-progress
      show-value
      font-size="32px"
      :value="counterSync.scores.current"
      :max="counterSync.scores.start"
      size="300px"
      :thickness="0.22"
      color="grey-3"
      :track-color="completed ? 'green' : 'orange'"
      class="col-auto justify-center"
    >
      <span v-if="!completed">
        {{ $tc('general.counters.goal.left', counterSync.scores.current) }}
      </span>
      <span v-else>
        Passed!
      </span>
    </q-circular-progress>
    <div class="col-12 q-mt-xl">
      <div class='row'>
        <add-button class="col flex" :class='{"justify-end": !completed, "justify-center": completed }' :label="$t('back')" @success="back" />
        <add-button v-if="!completed" class="col flex justify-center q-mx-md" :label="$t('Add')" @success="forward" />
        <div v-if="!completed" class='col'>
          <q-fab class='full-height' square color="primary" icon="keyboard_arrow_up" direction="up">
            <q-fab-action
              v-for='(option, index) in plusOptions'
              :key='index'
              :color="index % 2 ? 'primary' : 'secondary'"
              @click="forward(option)"
              :label="'+' + option"
            />
          </q-fab>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Emit } from 'vue-property-decorator'
import AddButton from 'components/helpers/buttons/AddButton.vue'
import Confirm from 'components/helpers/buttons/Confirm.vue'
import { Counter } from 'src/core/entities'
import { GoalCounterScore } from 'src/core/entities/Counter'

@Component({
  components: { Confirm, AddButton }
})
export default class GoalCounter extends Vue {
  @PropSync('counter', { type: Object, required: true })
  public counterSync!: Counter<GoalCounterScore>
  public completed = false
  public plusOptions = [1, 5, 10, 25, 50, 100, 250, 500]

  mounted() {
    this.completed = this.counterSync.scores.current === 0
  }

  @Emit('update:counter')
  forward(current: number) {
    if (this.counterSync.scores.current <= current) {
      this.counterSync.scores.current = 0
      this.completed = true

      this.$q.notify({
        type: 'positive',
        message: 'Goal is done for today. Great job!'
      })
    } else {
      this.counterSync.scores.current -= current
    }

    return this.counterSync
  }

  @Emit('update:counter')
  back(current: number) {
    if (current > 0) this.completed = false
    this.counterSync.scores.current += current

    return this.counterSync
  }
}
</script>
