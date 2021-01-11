<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { Loading } from 'quasar';

export default Vue.extend({
  name: 'App',
  preFetch(data) {
    Loading.show();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    return data.store.dispatch('persistent/loadStore').then(() => Loading.hide());
  }
})
</script>
