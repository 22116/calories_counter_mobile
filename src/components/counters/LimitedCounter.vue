<template>
  <div class='content-center justify-center row'>
    <q-circular-progress
      show-value
      font-size="32px"
      :value="counterSync.scores.current"
      :max="counterSync.scores.limit"
      size="300px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="col-auto justify-center"
    >
      <span :class="{'text-red': counterSync.scores.current > counterSync.scores.limit}">
        {{ counterSync.scores.current }}/{{ counterSync.scores.limit }}
      </span>
    </q-circular-progress>
    <div class="col-12 q-mt-xl">
      <div class='row'>
        <add-button class="col flex justify-end" :label="'Add'" @success="add" />
        <confirm class="col flex justify-center q-mx-md" :label="$t('general.reset')" :question="$t('modals.counter.reset.title')" @success="reset" />
        <div class='col'>
          <q-fab class='full-height' square color="primary" icon="keyboard_arrow_up" direction="up">
            <q-fab-action
              v-for='(option, index) in plusOptions'
              :key='index'
              :color="index % 2 ? 'primary' : 'secondary'"
              @click="add(option)"
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
import { LimitedCounterScore } from 'src/core/entities/Counter'

@Component({
  components: { Confirm, AddButton }
})
export default class LimitedCounter extends Vue {
  @PropSync('counter', { type: Object, required: true })
  public counterSync!: Counter<LimitedCounterScore>
  public plusOptions = [1, 5, 10, 25, 50, 100, 250, 500]

  @Emit('update:counter')
  add(current: number) {
    this.counterSync.scores.current += current

    return this.counterSync
  }

  @Emit('update:counter')
  reset() {
    this.counterSync.scores.current = 0

    return this.counterSync
  }
}
</script>
