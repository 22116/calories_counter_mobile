<template>
  <q-dialog v-model="prompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">{{ question }}</div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" @click="$emit('finished')" v-close-popup />
        <q-btn flat label="Ok" @click="() => {$emit('success'); $emit('finished')}" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, VModel } from 'vue-property-decorator'

@Component
export default class Confirm extends Vue {
  @VModel({type: Boolean, required: true}) readonly prompt!: string;
  @Prop({type: String, default: 'Are you sure?'}) readonly question!: string;
}
</script>
