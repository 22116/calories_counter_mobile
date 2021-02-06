/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment */
import { sqlite, Table } from 'websql-orm'

export abstract class Repository<T extends Table> {
  find(id: string, field = 'id'): Promise<T|null> {
    const params: Record<string, any> = {}

    params[field] = id

    return sqlite.queryFirst(this.factory(), params)
  }

  findBy(params: Record<string, any>): Promise<T[]> {
    return sqlite.query(this.factory(), params)
  }

  findOneBy(params: Record<string, any>): Promise<T|null> {
    return sqlite.queryFirst(this.factory(), params)
  }

  findAll(): Promise<Array<T>> {
    return sqlite.query(this.factory(), [])
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

  abstract factory(): T;
}
