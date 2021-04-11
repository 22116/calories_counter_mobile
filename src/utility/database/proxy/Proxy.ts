import { Table } from 'websql-orm'
import { Repository } from 'src/utility/database/Repository'

export interface Proxy {
  handle<T extends Table|Table[]|null>(result: Promise<T>): Promise<T>
  clear(): this
  clearScope(): this
  setRepository(repository: Repository<Table>): this
}

export class EmptyProxy implements Proxy {
  handle<T extends Table|Table[]|null>(result: Promise<T>): Promise<T> {
    return result
  }

  clear(): this {
    return this
  }

  clearScope(): this {
    return this
  }

  setRepository(): this {
    return this
  }
}
