import { Repository } from 'src/core/repositories/Repository'
import { Setting, SettingName } from 'src/core/entities/Setting'

export class SettingRepository extends Repository<Setting> {
  find(name: SettingName, field = 'name'): Promise<Setting> {
    return super.find(name, field).then((setting) => {
      if (setting !== null) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          setting.value = JSON.parse(setting.value)
        } catch (_err) {}

        return setting
      }

      const value = new Setting()
      value.name = name
      value.value = null

      return value
    })
  }

  factory(): Setting {
    return new Setting()
  }
}
