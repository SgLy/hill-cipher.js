"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hill_cipher_1 = require("./hill-cipher");
var cipher = new hill_cipher_1.default({
    key: 'this is a test message.',
    template: ' .,!?abcdefghijklmnopqrstuvwxyz0123456789',
});
var s = cipher.encrypt('test');
console.log(s);
var x = cipher.decrypt(s);
console.log(x);
//# sourceMappingURL=index.js.map