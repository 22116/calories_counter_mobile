import { sqlite, Table } from 'websql-orm'
import { EmptyProxy, Proxy } from './proxy/Proxy'
import { cloneDeep } from 'lodash'

export abstract class Repository<T extends Table> {
  protected proxy: Proxy = new EmptyProxy()

  find(id: string, field = 'id'): Promise<T|null> {
    const params: Record<string, any> = {}

    params[field] = id

    return this.proxy.handle(sqlite.queryFirst(this.factory(), params))
  }

  findBy(params: Record<string, any>): Promise<T[]> {
    return this.proxy.handle(sqlite.query(this.factory(), params))
  }

  findOneBy(params: Record<string, any>): Promise<T|null> {
    return this.proxy.handle(sqlite.queryFirst(this.factory(), params))
  }

  findAll(): Promise<Array<T>> {
    return this.proxy.handle(sqlite.query(this.factory(), []))
  }

  remove(id: string): Promise<boolean> {
    return sqlite.delete(this.factory(), id)
  }

  save(object: T): Promise<number> {
    return sqlite.save(object)
  }

  update(object: T): Promise<number> {
    return sqlite.update(object)
  }

  clear(): this {
    this.proxy.clear()

    return this
  }

  clearScope(): this {
    this.proxy.clearScope()

    return this
  }

  setProxy(proxy: Proxy): this {
    const copy = cloneDeep(this)
    copy.proxy = proxy
    copy.proxy.setRepository(copy)

    return copy
  }

  abstract factory(): T;
}
