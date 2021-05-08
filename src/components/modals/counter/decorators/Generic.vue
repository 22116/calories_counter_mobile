<template>
    <div>
      <q-card-section class="q-pt-none">
        <q-input v-model.trim="counter.name" :label="$t('general.name')" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input v-model.trim="counter.description" :label="$t('general.description')" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-select v-model="counter.icon" :options="icons" :label="$t('general.icon')">
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
import { Counter, Score } from 'src/core/entities/counter'
import iconsList from 'src/components/models/icons'

@Component
export default class Generic extends Vue {
  @VModel({type: Object, required: true}) public counter!: Counter<Score>

  public icons = iconsList
}
</script>
