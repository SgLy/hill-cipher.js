import Matrix from './matrix';
import { extendedGcd, leastLargerSquare, twoDimArrayFactory } from './util';

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

function stringToTwoDimArray(
  s: string,
  rows: number,
  cols: number,
  template: string,
  padFunction: (index: number, templateLength: number) => number = () => 0,
) {
  const arr = twoDimArrayFactory(rows, cols, 0);
  for (let r = 0, position = 0; r < rows; ++r) {
    for (let c = 0; c < cols; ++c, ++position) {
      const char =
        s[position] || template[padFunction(position, template.length)];
      const v = template.indexOf(char);
      if (v === -1 || v > template.length) {
        throw new Error(
          `"${char}" not found in template "${template}" (at key position ${position})`,
        );
      }
      arr[r][c] = v;
    }
  }
  return arr;
}

export default class HillCipher {
  public static DEFAULT_TEMPLATE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private size: number;
  private keyMatrix: Matrix;
  private invertedMatrix: Matrix;
  private template: string;
  private mod: number;

  constructor(option: IHillCipherConstructOption) {
    // parse key text to matrix
    const template = option.template || HillCipher.DEFAULT_TEMPLATE;
    const mod = template.length;
    const keyLength = leastLargerSquare(option.key.length);
    const size = Math.floor(Math.sqrt(keyLength));
    const keyArr = stringToTwoDimArray(
      option.key,
      size,
      size,
      template,
      (i, l) => Math.floor(i % l),
    );
    const keyMatrix = Matrix.from(keyArr);

    // get integer inverse of key matrix
    let inverse = keyMatrix.integerInverse;
    if (inverse === undefined) throw new Error('Invalid key (singular)');

    // get multiplier
    const scalar = Math.floor(keyMatrix.multiplyMatrix(inverse).at(0, 0) % mod);
    const solution = extendedGcd(mod, scalar);
    if (solution.gcd !== 1) throw new Error('Invalid key (gcd not one)');
    inverse = inverse.multiplyScalar(solution.y).modulo(mod);

    this.mod = mod;
    this.template = template;
    this.size = size;
    this.keyMatrix = keyMatrix;
    this.invertedMatrix = inverse;
  }

  public encrypt(text: string) {
    const cols = this.size;
    const rows = Math.ceil(text.length / cols);
    const arr = stringToTwoDimArray(text, rows, cols, this.template);
    const m = Matrix.from(arr)
      .multiply(this.keyMatrix)
      .modulo(this.mod);
    const result = new Array(text.length).fill(this.template[0]);
    for (let r = 0, position = 0; r < m.rows; ++r) {
      for (let c = 0; c < m.cols; ++c, ++position) {
        result[position] = this.template[m.at(r, c)];
      }
    }
    return result.join('');
  }

  public decrypt(cipher: string) {
    const cols = this.size;
    const rows = Math.ceil(cipher.length / cols);
    const arr = stringToTwoDimArray(cipher, rows, cols, this.template);
    const m = Matrix.from(arr)
      .multiply(this.invertedMatrix)
      .modulo(this.mod);
    const result = new Array(cipher.length).fill(this.template[0]);
    for (let r = 0, position = 0; r < m.rows; ++r) {
      for (let c = 0; c < m.cols; ++c, ++position) {
        result[position] = this.template[m.at(r, c)];
      }
    }
    return result.join('');
  }
}
