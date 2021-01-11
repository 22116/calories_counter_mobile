<template>
  <div class="q-pa-md">
    <q-toggle label="Use dark theme" v-model="profile.dark" @input="darkChanged" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Profile } from 'src/store/persistent/state';

@Component
export default class Settings extends Vue {
  public profile: Profile;

  public constructor() {
    super();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    this.profile = this.$store.getters['persistent/profile'];
  }

  public darkChanged(value: boolean) {
    this.profile.dark = value;
    this.$q.dark.set(this.profile.dark);
    void this.$store.dispatch('persistent/updateProfile', this.profile);
  }
};
</script>
