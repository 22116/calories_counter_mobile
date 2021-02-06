import { column, ColumnType, database, Table } from 'websql-orm'
import { DB_NAME } from 'src/core/constants'

export enum SettingName {
  Dark = 'dark',
  Version = 'version',
  Theme = 'theme',
}

@database(DB_NAME, 'settings')
export class Setting extends Table {
  @column(ColumnType.STRING | ColumnType.PRIMARY) name!: SettingName
  @column(ColumnType.STRING) value!: any
}
