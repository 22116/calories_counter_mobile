<template>
  <q-btn label="Create counter" color="primary" icon-right="add_task" @click="prompt = true">
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Which counter you would like to create?</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model.trim="counter.name" label="Name" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model.trim="counter.description" label="Description" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select v-model="counter.icon" :options="icons">
            <template v-slot:append>
              <q-avatar>
                <q-icon :name="counter.icon" />
              </q-avatar>
            </template>
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section avatar>
                  <q-icon :name="scope.opt" />
                </q-item-section>
                <q-item-section>
                  <q-item-label v-html="scope.opt" />
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select v-model="type" :options="types" label="Type" />
        </q-card-section>

        <q-card-section v-if="isLimitedType" class="q-pt-none">
          <q-input v-model.number="counter.limit" min="0" label="Limit" />
          <q-input v-model.number="counter.current" min="0" label="Default" />
        </q-card-section>

        <q-card-section v-if="isGoalType" class="q-pt-none">
          <q-input v-model.number="counter.current" min="0" label="Goal" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add" @click="$emit('success', counter)" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-btn>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import {Counter, CounterType} from 'src/store/persistent/counters-models'

@Component
export default class CreateCounter extends Vue {
  public prompt = false;
  public counter: Counter = {
    name: '',
    description: '',
    type: CounterType.Binary,
    icon: 'label',
    value: false,
    createdAt: new Date().toDateString()
  };
  public type = {
    label: 'Binary',
    value: CounterType.Binary,
  }
  public icons = [
    'label',
    'help',
    'gavel',
    'grade',
    'mediation',
    'offline_bolt',
    'preview',
    'reorder',
    'source',
    'touch_app',
    'visibility',
    'error',
    'loop',
    'movie',
    'web',
    'call',
    'calculate',
  ];

  get types() {
    const data = Object.values(CounterType)
    const values = data.slice(data.length / 2, data.length)
    const keys = data.slice(0, data.length / 2)

    return values.map((value, index) => {
      return {
        label: keys[index],
        value,
      }
    })
  }

  get isLimitedType(): boolean {
    return this.counter.type == CounterType.Limited
  }

  get isGoalType(): boolean {
    return this.counter.type == CounterType.Goal
  }

  @Watch('type')
  onTypeChanged(typeData: {value: number}) {
    this.counter.type = typeData.value

    if (this.counter.type === CounterType.Limited) {
      this.counter.limit = 100
      this.counter.current = 0
    } else {
      delete this.counter.limit
      delete this.counter.current
    }

    if (this.counter.type === CounterType.Goal) {
      this.counter.current = 100
    } else {
      delete this.counter.current
    }

    if (this.counter.type === CounterType.Binary) {
      this.counter.value = false
    } else {
      delete this.counter.value
    }
  }
}
</script>
