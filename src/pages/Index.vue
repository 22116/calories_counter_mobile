<template>
  <q-page class="row items-center justify-evenly">
    <counter :limit=1000></counter>
  </q-page>
</template>

<script lang="ts">
import Counter from 'components/ClassComponent.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: { Counter }
})
export default class PageIndex extends Vue {};
</script>
