<template>
  <div>
    <q-btn :label="label" size="xl" color="primary" @click="prompt = true" />
    <confirm-modal v-model='prompt' :question='question' @success="$emit('success')" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ConfirmModal from 'src/components/helpers/modals/Confirm.vue'

@Component({
  components: {ConfirmModal}
})
export default class Confirm extends Vue {
  @Prop({type: String, required: true}) readonly label!: string;
  @Prop({type: String, default: 'Are you sure?'}) readonly question!: string;

  prompt = false;
}
</script>
