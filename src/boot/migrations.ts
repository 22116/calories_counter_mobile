import { boot } from 'quasar/wrappers'
import { Loading } from 'quasar'
import { EnvConfig, sqlite } from 'websql-orm'
import { DB_NAME } from 'src/core/constants'
import { Counter, History, Setting } from 'src/core/entities'

function deviceReady(): Promise<void> {
  return new Promise<void>(((resolve) => {
    document.addEventListener('deviceready', () => resolve(), false)
  }))
}

export default boot(async () => {
  if (process.env.PROD) {
    EnvConfig.useCordovaSqliteStorage = true

    await deviceReady()
  }

  // Remove timezone specific part as websql-orm relies on this function to play with data
  Date.prototype.toISOString = function() {
    return this.getFullYear().toString() + '-' +
      ('0' + (this.getMonth() + 1).toString()).slice(-2) + '-' +
      ('0' + this.getDate().toString()).slice(-2)
  }

  Loading.show()

  await sqlite.init(new Setting())
  await sqlite.init(new Counter())
  await sqlite.init(new History())

  await sqlite.fromSqlByJs(DB_NAME, `INSERT OR IGNORE INTO settings (name, value) VALUES
    ('dark', 'auto'),
    ('theme', '#1976D2'),
    ('version', 1)
  `, [])

  Loading.hide()
})
