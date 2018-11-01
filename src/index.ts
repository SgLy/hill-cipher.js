import {Matrix} from './matrix';

// tslint:disable
const m = Matrix.from([
  [13, 15, 2, 34],
  [4, 5, 1, 4],
  [6, 20, 8, 5],
  [1, 2, 3, 4]
]);

const inv = m.inverse;
if (inv) {
  console.log(inv.string);
  console.log(inv.multiply(316).string);
}

const iinv = m.integerInverse;
if (iinv) {
  console.log(iinv.string);
  console.log(m.multiply(iinv).string);
}
