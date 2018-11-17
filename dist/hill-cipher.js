"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var matrix_1 = require("./matrix");
var util_1 = require("./util");
function stringToTwoDimArray(s, rows, cols, template, padFunction) {
    if (padFunction === void 0) { padFunction = function () { return 0; }; }
    var arr = util_1.twoDimArrayFactory(rows, cols, 0);
    for (var r = 0, position = 0; r < rows; ++r) {
        for (var c = 0; c < cols; ++c, ++position) {
            var char = s[position] || template[padFunction(position, template.length)];
            var v = template.indexOf(char);
            if (v === -1 || v > template.length) {
                throw new Error("\"" + char + "\" not found in template \"" + template + "\" (at key position " + position + ")");
            }
            arr[r][c] = v;
        }
    }
    return arr;
}
var HillCipher = /** @class */ (function () {
    function HillCipher(option) {
        // parse key text to matrix
        var template = option.template || HillCipher.DEFAULT_TEMPLATE;
        var mod = template.length;
        var keyLength = util_1.leastLargerSquare(option.key.length);
        var size = Math.floor(Math.sqrt(keyLength));
        var keyArr = stringToTwoDimArray(option.key, size, size, template, function (i, l) { return Math.floor(i % l); });
        var keyMatrix = matrix_1.default.from(keyArr);
        // get integer inverse of key matrix
        var inverse = keyMatrix.integerInverse;
        if (inverse === undefined)
            throw new Error('Invalid key (singular)');
        // get multiplier
        var scalar = Math.floor(keyMatrix.multiplyMatrix(inverse).at(0, 0) % mod);
        var solution = util_1.extendedGcd(mod, scalar);
        if (solution.gcd !== 1)
            throw new Error('Invalid key (gcd not one)');
        inverse = inverse.multiplyScalar(solution.y).modulo(mod);
        this.mod = mod;
        this.template = template;
        this.size = size;
        this.keyMatrix = keyMatrix;
        this.invertedMatrix = inverse;
    }
    HillCipher.prototype.encrypt = function (text) {
        var cols = this.size;
        var rows = Math.ceil(text.length / cols);
        var arr = stringToTwoDimArray(text, rows, cols, this.template);
        var m = matrix_1.default.from(arr)
            .multiply(this.keyMatrix)
            .modulo(this.mod);
        var result = new Array(text.length).fill(this.template[0]);
        for (var r = 0, position = 0; r < m.rows; ++r) {
            for (var c = 0; c < m.cols; ++c, ++position) {
                result[position] = this.template[m.at(r, c)];
            }
        }
        return result.join('');
    };
    HillCipher.prototype.decrypt = function (cipher) {
        var cols = this.size;
        var rows = Math.ceil(cipher.length / cols);
        var arr = stringToTwoDimArray(cipher, rows, cols, this.template);
        var m = matrix_1.default.from(arr)
            .multiply(this.invertedMatrix)
            .modulo(this.mod);
        var result = new Array(cipher.length).fill(this.template[0]);
        for (var r = 0, position = 0; r < m.rows; ++r) {
            for (var c = 0; c < m.cols; ++c, ++position) {
                result[position] = this.template[m.at(r, c)];
            }
        }
        return result.join('');
    };
    HillCipher.DEFAULT_TEMPLATE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return HillCipher;
}());
exports.default = HillCipher;
//# sourceMappingURL=hill-cipher.js.map