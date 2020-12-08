<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { Profile } from 'src/store/calories/state';
import { Loading } from 'quasar';

export default Vue.extend({
  name: 'App',
  preFetch(data) {
    Loading.show();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    return data.store.dispatch('calories/loadStore').then(() => Loading.hide());
  },
  mounted() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const profile = Object.assign(this.$store.getters['calories/profile']) as Profile;

    if (profile.dark !== null) {
      this.$q.dark.set(profile.dark);
    }
  }
})
</script>
