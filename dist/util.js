"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapEach = function (n, f) {
    return Array.apply(null, { length: n }).map(function (_, i) { return f(i); });
};
exports.twoDimArrayFactory = function (rows, cols, value) {
    if (value === undefined) {
        return exports.mapEach(rows, function () { return new Array(cols); });
    }
    return exports.mapEach(rows, function () { return new Array(cols).fill(value); });
};
function leastLargerSquare(x) {
    // tslint:disable-next-line:no-magic-numbers
    return ~~(Math.pow(Math.ceil(Math.sqrt(x)), 2));
}
exports.leastLargerSquare = leastLargerSquare;
var EPS = 1e-4;
exports.notZero = function (x) { return Math.abs(x) > EPS; };
exports.isZero = function (x) { return Math.abs(x) < EPS; };
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
exports.extendedGcd = function (a, b) {
    if (~~b === 0) {
        return { gcd: ~~a, x: 1, y: 0 };
    }
    var _a = exports.extendedGcd(~~b, ~~a % ~~b), gcd = _a.gcd, r = __rest(_a, ["gcd"]);
    var x = r.y;
    var y = r.x;
    y -= ~~x * ~~(~~a / ~~b);
    return { gcd: gcd, x: x, y: y };
};
//# sourceMappingURL=util.js.map