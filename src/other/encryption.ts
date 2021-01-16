// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as uuid from 'uuid';

export interface HashGenerator {
  generate(size: number): string;
}

export class IdGenerator implements HashGenerator {
  generate(): string {
    return uuid.v4()
  }
}
