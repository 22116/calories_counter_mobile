<template>
  <div>
    <q-circular-progress
      show-value
      font-size="32px"
      :value="0"
      :max="counterSync.current"
      size="300px"
      :thickness="0.22"
      :color="completed ? 'green' : 'orange'"
      track-color="grey-3"
      class="row justify-center q-ma-md"
    >
      <span v-if="!completed">
        {{ counterSync.current }} left
      </span>
      <span v-else>
        Passed!
      </span>
    </q-circular-progress>
    <div class="row q-mt-xl">
      <add-button class="col flex justify-center" :label="'Back'" @success="back" />
      <add-button v-if="!completed" class="col flex justify-center" :label="'Forward'" @success="forward" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Emit } from 'vue-property-decorator';
import AddButton from 'components/helpers/modals/AddButton.vue';
import Confirm from 'components/helpers/modals/Confirm.vue';
import { GoalCounter as Type } from 'src/store/persistent/counters-models';

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

    return this.counterSync;
  }

  @Emit('update:counter')
  back(current: number) {
    if (current > 0) this.completed = false
    this.counterSync.current += current;

    return this.counterSync;
  }
}
</script>
