import {
  gcd,
  isZero,
  lcm,
  mapEach,
  notZero,
} from './util';

export default class Matrix {

  /**
   * get row numbers
   */
  get rows(): number {
    return this.n;
  }

  /**
   * get column numbers
   */
  get cols(): number {
    return this.m;
  }

  /**
   * check if it is square matrix
   */
  get isSquare(): boolean {
    return this.n === this.m;
  }

  /**
   * raw data
   */
  get raw() {
    return this.a;
  }

  get string(): string {
    return mapEach(this.n, r => {
      const offset = r * this.m;
      const s = mapEach(this.m, c => this.a[offset + c].toFixed(1));
      return `|${s.join(', ')}|\n`;
    }).join('');
  }

  /**
   * inverse of the matrix
   * the matrix should be square matrix
   * if it is a singular matrix, `undefined` returned
   */
  get inverse(): Matrix | undefined {
    if (!this.isSquare) { throw new TypeError('Not a square matrix'); }
    const t = Matrix.from(this); // calculate with copy
    const n = t.n; // shortcut
    const r = Matrix.unit(n);

    for (let i = 0; i < n; ++i) {
      // i-th round make this[i][i] to 1 and this[x][i] to 0
      // 0 row to i - 1 row should satisfy this

      // find a row with this[j][i] !== 0 to be new i-th row
      // this ensures this[i][i] !== 0
      // if all this[j][i] === 0, no solution
      let noSolution = true;
      for (let j = i; j < n; ++j) {
        if (notZero(t.at(j, i))) {
          noSolution = false;
          t.swapRow(i, j);
          r.swapRow(i, j);
          break;
        }
      }
      if (noSolution) { return undefined; }

      // make all this[j][i] to 0
      const scalar = 1.0 / t.at(i, i);
      for (let j = 0; j < n; ++j) {
        t.replace(i, j, x => x * scalar);
        r.replace(i, j, x => x * scalar);
      }
      for (let j = 0; j < n; ++j) {
        if (i === j) { continue; }
        // row[j] -= row[i]
        const scalar = t.at(j, i);
        for (let k = 0; k < n; ++k) {
          t.replace(j, k, x => x - t.at(i, k) * scalar);
          r.replace(j, k, x => x - r.at(i, k) * scalar);
        }
      }
    }
    return r;
  }

  /**
   * inverse of the matrix, integer version
   * the matrix should be square matrix
   * if it is a singular matrix, `undefined` returned
   * the returned matrix will be all integer, which can be obtained by inverse matrix with an integer scalar
   * multiply the returned matrix will result in an integer-scalar-scaled unit matrix
   * like adjugate matrix, but calculated in inverse way
   */
  get integerInverse(): Matrix | undefined {
    if (!this.isSquare) { throw new TypeError('Not a square matrix'); }
    let t = Matrix.from(this); // calculate with copy
    const n = t.n; // shortcut
    let r = Matrix.unit(n);

    const reduceRow = (i: number) => {
      // divide gcd of row[i] of two matrix
      const reducer = Math.floor(Math.abs(gcd(
        gcd(...[].slice.call(t.row(i))),
        gcd(...[].slice.call(r.row(i))),
      )));
      t = t.rowDivide(i, reducer);
      r = r.rowDivide(i, reducer);
    };

    const reduce = () => {
      for (let i = 0; i < n; ++i) reduceRow(i);
    };

    for (let i = 0; i < n; ++i) {
      // i-th round make this[i][i] to 1 and this[x][i] to 0
      // 0 row to i - 1 row should satisfy this

      // find a row with this[j][i] !== 0 to be new i-th row
      // this ensures this[i][i] !== 0
      // if all this[j][i] === 0, no solution
      let noSolution = true;
      for (let j = i; j < n; ++j) {
        if (notZero(t.at(j, i))) {
          noSolution = false;
          t.swapRow(i, j);
          r.swapRow(i, j);
          break;
        }
      }
      if (noSolution) { return undefined; }

      // make all this[j][i] to 0
      for (let j = 0; j < n; ++j) {
        if (i === j) continue;
        if (isZero(t.at(j, i))) continue;
        // row[j] -= row[i]
        const l = lcm(t.at(i, i), t.at(j, i));
        const scalarI = l / t.at(i, i);
        const scalarJ = l / t.at(j, i);
        for (let k = 0; k < n; ++k) {
          t.replace(j, k, x => x * scalarJ - t.at(i, k) * scalarI);
          r.replace(j, k, x => x * scalarJ - r.at(i, k) * scalarI);
        }
      }
      reduce();
    }
    // make all this[i][i] to the same
    const l = Math.floor(Math.abs(lcm(...mapEach(n, i => t.at(i, i)))));
    for (let i = 0; i < n; ++i) {
      const scalar = l / t.at(i, i);
      for (let j = 0; j < n; ++j) {
        t.replace(i, j, x => x * scalar);
        r.replace(i, j, x => x * scalar);
      }
    }
    return r;
  }

  /**
   * return a unit matrix with `size` rows and columns
   */
  public static unit(size: number): Matrix {
    const m = new Matrix(size, size);
    for (let i = 0; i < size; ++i) { m.change(i, i, 1); }
    return m;
  }

  public static from(x: (number | string)[][] | Matrix): Matrix {
    if (x instanceof Matrix) { return this.fromMatrix(x); } else { return this.fromTwoDimArray(x); }
  }
  public static fromTwoDimArray(arr: (number | string)[][]): Matrix {
    const n = arr.length;
    if (n === 0) {
      throw new TypeError('Should have at least one row');
    }
    const m = arr[0].length;
    for (let i = 0; i < n; ++i) {
      if (arr[i].length !== m) {
        throw new TypeError('All row should have same columns');
      }
    }
    const r = new Matrix(n, m);
    for (let i = 0; i < n; ++i) {
      for (let j = 0; j < m; ++j) {
        const t = arr[i][j];
        if (typeof t === 'number') { r.change(i, j, t); } else { r.change(i, j, parseFloat(t)); }
      }
    }
    return r;
  }
  public static fromMatrix(o: Matrix): Matrix {
    const r = new Matrix(o.rows, o.cols);
    for (let i = 0; i < o.rows; ++i) {
      for (let j = 0; j < o.cols; ++j) {
        r.change(i, j, o.at(i, j));
      }
    }
    return r;
  }
  private n: number;
  private m: number;
  private a: Float64Array;

  /**
   * new zero Matrix from rows count and columns count
   */
  constructor(rows: number, cols: number) {
    this.n = rows;
    this.m = cols;
    this.a = new Float64Array(rows * cols);
  }

  /**
   * get row `r`
   */
  public row(r: number): Float64Array {
    this.rowsCheck(r);
    return this.a.slice(r * this.m, (r + 1) * this.m);
  }

  /**
   * get column `c`
   */
  public col(c: number): Float64Array {
    this.colsCheck(c);
    return new Float64Array(this.n).map(
      (_, i) => this.a[i * this.m + c],
    );
  }

  /**
   * get an element by row number and column number
   */
  public at(r: number, c: number): number {
    this.rangeCheck(r, c);
    return this.a[r * this.cols + c];
  }

  /**
   * shortcut for `at` method
   * get an element by row number and column number
   */
  public _(r: number, c: number): number {
    return this.at(r, c);
  }

  /**
   * change an element by row number and column number
   */
  public change(r: number, c: number, newVal: number): number {
    this.rangeCheck(r, c);
    return this.a[r * this.cols + c] = newVal;
  }

  /**
   * shortcut for `change` method
   * change an element by row number and column number
   */
  public $(r: number, c: number, newVal: number): number {
    return this.change(r, c, newVal);
  }

  /**
   * replace an element by row number and column number
   */
  public replace(r: number, c: number, func: (x: number) => number): number {
    this.rangeCheck(r, c);
    const i = r * this.cols + c;
    return this.a[i] = func(this.a[i]);
  }

  /**
   * shortcut for `replace` method
   * replace an element by row number and column number
   */
  public $$(r: number, c: number, func: (x: number) => number): number {
    return this.replace(r, c, func);
  }

  /**
   * swap row `i` and row `j`
   */
  public swapRow(i: number, j: number): void {
    if (i === j) { return; }
    const I = i * this.m;
    const J = j * this.m;
    for (let k = 0; k < this.m; ++k) {
      [this.a[I + k], this.a[J + k]] = [this.a[J + k], this.a[I + k]];
    }
  }

  public multiply(x: number | Matrix): Matrix {
    if (typeof x === 'number') { return this.multiplyScalar(x); } else { return this.multiplyMatrix(x); }
  }
  public multiplyScalar(x: number): Matrix {
    const r = Matrix.from(this);
    for (let i = 0; i < this.n; ++i) {
      for (let j = 0; j < this.m; ++j) {
        r.replace(i, j, t => t * x);
      }
    }
    return r;
  }
  public multiplyMatrix(x: Matrix): Matrix {
    if (this.m !== x.rows) {
      throw new TypeError('Excepted left-side columns number equal to right-side row number');
    }
    const r = new Matrix(this.n, x.cols);

    for (let i = 0; i < this.n; ++i) {
      for (let j = 0; j < x.cols; ++j) {
        for (let k = 0; k < this.m; ++k) {
          r.replace(i, j, t => t + this.at(i, k) * x.at(k, j));
        }
      }
    }
    return r;
  }

  public divide(x: number): Matrix {
    if (isZero(x)) {
      throw new EvalError('Divided by zero');
    }
    const r = Matrix.from(this);
    for (let i = 0; i < this.n; ++i) {
      for (let j = 0; j < this.m; ++j) {
        r.replace(i, j, t => t / x);
      }
    }
    return r;
  }

  public modulo(x: number): Matrix {
    if (isZero(x)) {
      throw new EvalError('Divided by zero');
    }
    const r = Matrix.from(this);
    for (let i = 0; i < this.n; ++i) {
      for (let j = 0; j < this.m; ++j) {
        r.replace(i, j, t => Math.floor(t % x + x) % x);
      }
    }
    return r;
  }

  public rowDivide(i: number, x: number): Matrix {
    if (isZero(x)) {
      throw new EvalError('Divided by zero');
    }
    const r = Matrix.from(this);
    for (let j = 0; j < this.m; ++j) {
      r.replace(i, j, t => t / x);
    }
    return r;
  }

  /**
   * check whether row number is valid
   */
  private rowsCheck(r: number): void {
    if (r < 0 || r > this.n) {
      throw new RangeError(`Expected row between 0-${this.n} but got ${r}`);
    }
  }

  /**
   * check whether col number is valid
   */
  private colsCheck(c: number): void {
    if (c < 0 || c > this.m) {
      throw new RangeError(`Expected col between 0-${this.m} but got ${c}`);
    }
  }

  /**
   * check whether row number and col number are valid
   */
  private rangeCheck(r: number, c: number): void {
    this.rowsCheck(r);
    this.colsCheck(c);
  }
}
