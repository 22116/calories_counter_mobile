<template>
  <div class="q-pa-md">
    <div class='row'>
      <q-toggle :label="$t('pages.settings.dark')" v-model="dark.value" />
    </div>
    <div class='row full-width'>
      <color :label="$t('pages.settings.color')" v-model='theme.value' @update:theme='themeChanged' />
    </div>
    <div class='row'>
      <q-select
        v-model="locale.value"
        :options="localeOptions"
        :label="$t('pages.settings.language')"
        dense
        borderless
        emit-value
        map-options
        options-dense
        style="min-width: 150px"
      />
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
  public locale: Partial<Setting> = {value: this.$i18n.locale}

  public localeOptions = [
    { value: 'en', label: 'English' },
    { value: 'ru', label: 'Русский' }
  ]

  public __construct() {
    this.$q.loading.show()
  }

  async mounted() {
    this.dark = await this.$orm.repository.setting.find(SettingName.Dark)
    this.theme = await this.$orm.repository.setting.find(SettingName.Theme)
    this.locale = await this.$orm.repository.setting.find(SettingName.Locale)

    this.$q.loading.hide()
  }

  @Watch('dark.value')
  async darkChanged(value: boolean) {
    this.$q.dark.set(value)
    await this.$orm.repository.setting.save(this.dark as Setting)
  }

  @Watch('theme.value')
  async themeChanged(value: string) {
    colors.setBrand('primary', value)
    await this.$orm.repository.setting.save(this.theme as Setting)
  }

  @Watch('locale.value')
  async localeChanged(value: string) {
    this.$i18n.locale = value
    await this.$orm.repository.setting.save(this.locale as Setting)
  }
};
</script>
