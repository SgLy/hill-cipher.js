"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function leastLargerSquare(x) {
    // tslint:disable-next-line:no-magic-numbers
    return ~~(Math.pow(Math.ceil(Math.sqrt(x)), 2));
}
exports.leastLargerSquare = leastLargerSquare;
var EPS = 1e-4;
exports.notZero = function (x) { return Math.abs(x) > EPS; };
exports.gcd = function () {
    var n = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        n[_i] = arguments[_i];
    }
    var gcd2 = function (x, y) {
        var _a, _b;
        var a = x;
        var b = y;
        if (a < b)
            _a = [b, a], a = _a[0], b = _a[1];
        while (b !== 0)
            _b = [b, a % b], a = _b[0], b = _b[1];
        return a;
    };
    if (n.length === 0) {
        return 0;
    }
    if (n.length === 1) {
        return n[0];
    }
    return n.reduce(function (s, v) { return gcd2(s, v); });
};
exports.lcm = function () {
    var x = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        x[_i] = arguments[_i];
    }
    var lcm2 = function (a, b) {
        return ~~(a * b / exports.gcd(a, b));
    };
    if (x.length === 0) {
        return 0;
    }
    if (x.length === 1) {
        return x[0];
    }
    return x.reduce(function (s, v) { return lcm2(s, v); });
};
exports.mapEach = function (n, f) {
    return Array.apply(null, { length: n }).map(function (_, i) { return f(i); });
};
//# sourceMappingURL=util.js.map