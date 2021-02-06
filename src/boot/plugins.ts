import { boot } from 'quasar/wrappers'
import DatabasePlugin from 'src/plugins/database'

export default boot(({Vue}) => {
  Vue.use(DatabasePlugin)
})
