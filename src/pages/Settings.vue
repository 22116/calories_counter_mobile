<template>
  <div class="q-pa-md">
    <div class='row'>
      <q-toggle label="Use dark theme" v-model="profile.dark" />
    </div>
    <div class='row full-width'>
      <color label="Change application color" v-model='profile.theme' @update:theme='(theme) => themeChanged(theme)' />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Profile } from 'src/store/persistent/state'
import { colors } from 'quasar'
import Color from 'components/helpers/buttons/Color.vue'
@Component({
  components: { Color }
})
export default class Settings extends Vue {
  public profile: Profile;

  public constructor() {
    super()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    this.profile = this.$store.getters['persistent/profile']
  }

  @Watch('profile.dark')
  public darkChanged(value: boolean) {
    this.$q.dark.set(value)
    void this.$store.dispatch('persistent/updateProfile', this.profile)
  }

  @Watch('profile.theme')
  public themeChanged(value: string) {
    colors.setBrand('primary', value)
    void this.$store.dispatch('persistent/updateProfile', this.profile)
  }
};
</script>
