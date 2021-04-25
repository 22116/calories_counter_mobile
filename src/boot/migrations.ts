import { boot } from 'quasar/wrappers'
import { Loading } from 'quasar'
import { EnvConfig, sqlite } from 'websql-orm'
import { DB_NAME, VERSION } from 'src/core/constants'
import { Counter, History, Setting } from 'src/core/entities'
import { TimeoutList } from 'src/core/entities/Counter'
import { SettingRepository } from 'src/core/repositories'
import { SettingName } from 'src/core/entities/Setting'

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
    await sqlite.fromSqlByJs(
      DB_NAME,
      `ALTER TABLE counters ADD COLUMN timeouts TEXT DEFAULT '${JSON.stringify([TimeoutList.Daily])}'`,
      []
    )
  }

  version.value = VERSION

  await settingsRepository.save(version)

  if (!process.env.PROD) {
    await loadFixtures()
  }

  Loading.hide()
})

function deviceReady(): Promise<void> {
  return new Promise<void>(((resolve) => {
    document.addEventListener('deviceready', () => resolve(), false)
  }))
}

async function loadFixtures(): Promise<void> {
  await sqlite.fromSqlByJs(DB_NAME, `
    INSERT OR IGNORE INTO counters (id, name, description, type, icon, createdAt, theme, scores, enabled, timeouts) VALUES
        ('counter_1', 'Test1', 'test123', 1, 'user', '2021-04-01', 1, '{"value": false}', 1, '["daily"]'),
        ('counter_2', 'Test2', 'test124', 1, 'admin', '2021-04-22', 1, '{"value": false}', 1, '["daily"]'),
        ('counter_3', 'Test3', 'test125', 1, 'toilet', '2021-04-20', 1, '{"value": false}', 1, '["daily"]');
  `, [])
  await sqlite.fromSqlByJs(DB_NAME, `
    INSERT OR IGNORE INTO history (id, date, counter_id, scores) VALUES
        ('1', '2021-04-06', 'counter_1', '{"value": true}');
  `, [])
}
