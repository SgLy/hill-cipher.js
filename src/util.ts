export const mapEach: <T>(n: number, f: (i: number) => T) => T[] = (n, f) => {
  return Array.apply(null, { length: n }).map((_: null, i: number) => f(i));
};

export const twoDimArrayFactory = <T>(rows: number, cols: number, value?: T): T[][] => {
  if (value === undefined) {
    return mapEach(rows, () => new Array(cols));
  }
  return mapEach(rows, () => new Array(cols).fill(value));
};

export function leastLargerSquare(x: number) {
  // tslint:disable-next-line:no-magic-numbers
  return ~~(Math.pow(Math.ceil(Math.sqrt(x)), 2));
}

const EPS: number = 1e-4;
export const notZero = (x: number) => Math.abs(x) > EPS;
export const isZero = (x: number) => Math.abs(x) < EPS;

export const gcd = (...n: number[]) => {
  const gcd2 = (x: number, y: number) => {
    let a = x;
    let b = y;
    if (a < b) [a, b] = [b, a];
    while (b !== 0) [a, b] = [b, a % b];
    return a;
  };
  if (n.length === 0) { return 0; }
  if (n.length === 1) { return n[0]; }
  return n.reduce((s, v) => gcd2(s, v));
};

export const lcm = (...x: number[]) => {
  const lcm2 = (a: number, b: number) => {
    return ~~(a * b / gcd(a, b));
  };
  if (x.length === 0) { return 0; }
  if (x.length === 1) { return x[0]; }
  return x.reduce((s, v) => lcm2(s, v));
};

export const extendedGcd = (a: number, b: number): {x: number, y: number, gcd: number} => {
  if (~~b === 0) {
    return { gcd: ~~a, x: 1, y: 0 };
  }
  const {gcd, ...r} = extendedGcd(~~b, ~~a % ~~b);
  const x = r.y;
  let y = r.x;
  y -= ~~x * ~~(~~a / ~~b);
  return { gcd, x, y };
};
