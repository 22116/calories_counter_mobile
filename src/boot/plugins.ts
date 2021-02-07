import 'reflect-metadata'
import { boot } from 'quasar/wrappers'
import DatabasePlugin from 'src/plugins/database'
import DIPlugin from 'src/plugins/di'

export default boot(({Vue}) => {
  Vue.use(DIPlugin)
  Vue.use(DatabasePlugin)
})
