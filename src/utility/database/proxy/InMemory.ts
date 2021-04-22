import { sleep } from 'src/utility/helper'
import { Proxy } from 'src/utility/database/proxy/Proxy'
import { Repository } from 'src/utility/database/Repository'
import { Table } from 'websql-orm'
import { isEmpty } from 'lodash'

export class InMemory<T extends Table> implements Proxy {
  private static cache: Record<string, Record<string, unknown>> = {}
  private static status: Record<string, Record<string, boolean>> = {}

  private repository!: Repository<T>

  public constructor(private key = 'main') {

  }

  setRepository(repository: Repository<T>): this {
    this.repository = repository

    return this
  }

  clear(): this {
    if (InMemory.cache[this.repository.constructor.name]?.[this.key]) {
      delete InMemory.cache[this.repository.constructor.name][this.key]
    }

    return this
  }

  clearScope(): this {
    delete InMemory.cache[this.repository.constructor.name]

    return this
  }

  async handle<T extends Table|Table[]|null>(result: Promise<T>): Promise<T> {
    const scope = this.repository.constructor.name

    if (false === InMemory.status[scope]?.[this.key]) {
      await sleep(100)

      return await this.handle(result)
    }

    if (undefined === InMemory.cache[scope]?.[this.key]) {
      if (isEmpty(InMemory.status[scope])) {
        InMemory.status[scope] = {}
      }

      if (isEmpty(InMemory.cache[scope])) {
        InMemory.cache[scope] = {}
      }

      InMemory.status[scope][this.key] = false
      InMemory.cache[scope][this.key] = await result
      InMemory.status[scope][this.key] = true
    }

    return InMemory.cache[scope][this.key] as T
  }
}
