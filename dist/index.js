"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var matrix_1 = require("./matrix");
// tslint:disable
var m = matrix_1.Matrix.from([
    [13, 15, 2, 34],
    [4, 5, 1, 4],
    [6, 20, 8, 5],
    [1, 2, 3, 4]
]);
var inv = m.inverse;
if (inv) {
    console.log(inv.string);
    console.log(inv.multiply(316).string);
}
var iinv = m.integerInverse;
if (iinv) {
    console.log(iinv.string);
    console.log(m.multiply(iinv).string);
}
//# sourceMappingURL=index.js.map