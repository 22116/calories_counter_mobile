export interface HashGenerator {
  generate(size: number): string;
}

export class IdGenerator implements HashGenerator {
  generate(size = 64): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    let result = '';

    for (let i = 0; i < size; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
}
