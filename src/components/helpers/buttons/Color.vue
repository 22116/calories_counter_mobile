<template>
  <div>
    <q-btn :label="label" size="md" color="primary" @click="prompt = true" />
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <q-color no-header v-model="theme" class="my-picker full-width" />
        </q-card-section>

        <q-card-actions align="center" class="text-primary">
          <q-btn flat :label="$t('general.close')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, VModel } from 'vue-property-decorator'

@Component
export default class Color extends Vue {
  @Prop({type: String, required: true}) readonly label!: string;
  @VModel({type: String, required: true}) readonly theme!: string;

  prompt = false;
}
</script>
