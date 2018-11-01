import Matrix from './matrix';
import { leastLargerSquare } from './util';

interface IHillCipherConstructOption {
  /**
   * template for translating key and plaintext to number
   */
  template?: string;
  /**
   * key for encryption
   */
  key: string;
}

export default class HillCipher {
  public static DEFAULT_TEMPLATE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  constructor(option: IHillCipherConstructOption) {
    const template = option.template || HillCipher.DEFAULT_TEMPLATE;
    const keyLength = leastLargerSquare(option.key.length);
    const keyArr = new Array(keyLength);
    Array.from(option.key).forEach((c, i) => {
      const v = template.indexOf(c);
      if (v === -1 || v > template.length) {
        throw new Error(`"${c}" not found in template "${template}" (at key position ${i})`);
      }
      keyArr[i] = v;
    });
  }
}
