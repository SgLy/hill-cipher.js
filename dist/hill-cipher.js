"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var HillCipher = /** @class */ (function () {
    function HillCipher(option) {
        var template = option.template || HillCipher.DEFAULT_TEMPLATE;
        var keyLength = util_1.leastLargerSquare(option.key.length);
        var keyArr = new Array(keyLength);
        Array.from(option.key).forEach(function (c, i) {
            var v = template.indexOf(c);
            if (v === -1 || v > template.length) {
                throw new Error("\"" + c + "\" not found in template \"" + template + "\" (at key position " + i + ")");
            }
            keyArr[i] = v;
        });
    }
    HillCipher.DEFAULT_TEMPLATE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return HillCipher;
}());
exports.default = HillCipher;
//# sourceMappingURL=hill-cipher.js.map