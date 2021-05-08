import 'reflect-metadata'
import { boot } from 'quasar/wrappers'
import DatabasePlugin from 'src/plugins/database'
import DIPlugin from 'src/plugins/di'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from 'src/i18n'

Vue.use(VueI18n)
Vue.use(DIPlugin)
Vue.use(DatabasePlugin)

export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

export default boot(({ app }) => {
  // Remove timezone specific part as websql-orm relies on this function to play with data
  Date.prototype.toISOString = function() {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return this.getFullYear() + '-' +
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      ('0' + (this.getMonth()+1)).slice(-2) + '-' +
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      ('0' + this.getDate()).slice(-2)
  }

  app.i18n = i18n
})
