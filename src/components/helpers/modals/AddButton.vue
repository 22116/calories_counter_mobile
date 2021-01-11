<template>
  <div>
    <q-btn :label="label" color="primary" size="xl" @click="prompt = true" />
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">How much to add?</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input type="number" dense v-model.number="value" autofocus @keyup.enter="prompt = false" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add" @click="$emit('success', value)" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class AddButton extends Vue {
  @Prop({type: String, required: true}) readonly label!: string;

  prompt = false;
  value = 0;
}
</script>
