import { boot } from 'quasar/wrappers'
import { Loading } from 'quasar'
import { EnvConfig, sqlite } from 'websql-orm'
import { DB_NAME, VERSION } from 'src/core/constants'
import { Counter, History, Setting } from 'src/core/entities'
import { TimeoutList } from 'src/core/entities/Counter'
import { SettingRepository } from 'src/core/repositories'
import { SettingName } from 'src/core/entities/Setting'

function deviceReady(): Promise<void> {
  return new Promise<void>(((resolve) => {
    document.addEventListener('deviceready', () => resolve(), false)
  }))
}

export default boot(async ({ Vue }) => {
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
    ('version', :version)
  `, [VERSION])

  const settingsRepository = Vue.$container.resolve(SettingRepository)
  const version = await settingsRepository.find(SettingName.Version)

  if (version.value < 2) {
    await sqlite.fromSqlByJs(DB_NAME, 'ALTER TABLE counters ADD COLUMN timeouts DEFAULT :data', [[TimeoutList.Daily]])
  }

  version.value = VERSION

  await settingsRepository.save(version)

  Loading.hide()
})
