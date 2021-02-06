import { boot } from 'quasar/wrappers'
import { Loading } from 'quasar'
import { EnvConfig, sqlite } from 'websql-orm'
import { DB_NAME } from 'src/core/constants'
import { Counter, History, Setting } from 'src/core/entities'

export default boot(async () => {
  if (process.env.PROD) {
    EnvConfig.useCordovaSqliteStorage = true
  } else {
    // EnvConfig.enableDebugLog = true
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
