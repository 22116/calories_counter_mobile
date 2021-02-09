import 'reflect-metadata'
import { boot } from 'quasar/wrappers'
import DatabasePlugin from 'src/plugins/database'
import DIPlugin from 'src/plugins/di'

export default boot(({Vue}) => {
  // Remove timezone specific part as websql-orm relies on this function to play with data
  Date.prototype.toISOString = function() {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return this.getFullYear() + '-' +
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      ('0' + (this.getMonth()+1)).slice(-2) + '-' +
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      ('0' + this.getDate()).slice(-2)
  }

  Vue.use(DIPlugin)
  Vue.use(DatabasePlugin)
})
