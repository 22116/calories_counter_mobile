<template>
  <div class="q-pa-md">
    <div class='row'>
      <q-toggle label="Use dark theme" v-model="dark.value" />
    </div>
    <div class='row full-width'>
      <color label="Change application color" v-model='theme.value' @update:theme='themeChanged' />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { colors } from 'quasar'
import Color from 'components/helpers/buttons/Color.vue'
import { Setting, SettingName } from 'src/core/entities/Setting'

@Component({ components: { Color }})
export default class Settings extends Vue {
  public dark: Partial<Setting> = {value: false}
  public theme: Partial<Setting> = {value: ''}

  public __construct() {
    this.$q.loading.show()
  }

  async mounted() {
    this.dark = await this.$orm.repository.setting.find(SettingName.Dark)
    this.theme = await this.$orm.repository.setting.find(SettingName.Theme)
    this.$q.loading.hide()
  }

  @Watch('dark.value')
  async darkChanged(value: boolean) {
    this.$q.dark.set(value)
    await this.$orm.repository.setting.save(this.dark)
  }

  @Watch('theme.value')
  async themeChanged(value: string) {
    colors.setBrand('primary', value)
    await this.$orm.repository.setting.save(this.theme)
  }
};
</script>
