<template>
  <div>
    <q-btn :label="label" color="primary" @click="prompt = true" />
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ question }}</div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Ok" @click="$emit('success')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Prompt extends Vue {
  @Prop({type: String, required: true}) readonly label!: string;
  @Prop({type: String, default: 'Are you sure?'}) readonly question!: string;

  prompt = false;
}
</script>
