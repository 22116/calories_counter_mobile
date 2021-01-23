<template>
    <div>
      <q-card-section class="q-pt-none">
        <q-input v-model.trim="counter.name" label="Name" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input v-model.trim="counter.description" label="Description" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-select v-model="counter.icon" :options="icons" label="Icon">
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
    </div>
</template>

<script lang="ts">
import { Component, VModel, Vue } from 'vue-property-decorator'
import { Counter } from 'src/core/models/counter'
import iconsList from 'src/components/models/icons'

@Component
export default class Generic extends Vue {
  @VModel({type: Object, required: true}) public counter!: Counter

  public icons = iconsList
}
</script>
