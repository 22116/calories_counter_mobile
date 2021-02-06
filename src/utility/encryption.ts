import { v4 } from 'uuid'

export interface HashGenerator {
  generate(size: number): string;
}

export class IdGenerator implements HashGenerator {
  generate(): string {
    return v4()
  }
}
