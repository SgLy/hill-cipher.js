"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var Matrix = /** @class */ (function () {
    /**
     * new zero Matrix from rows count and columns count
     */
    function Matrix(rows, cols) {
        this.n = rows;
        this.m = cols;
        this.a = new Float64Array(rows * cols);
    }
    Object.defineProperty(Matrix.prototype, "rows", {
        /**
         * get row numbers
         */
        get: function () {
            return this.n;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "cols", {
        /**
         * get column numbers
         */
        get: function () {
            return this.m;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "isSquare", {
        /**
         * check if it is square matrix
         */
        get: function () {
            return this.n === this.m;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "raw", {
        /**
         * raw data
         */
        get: function () {
            return this.a;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "string", {
        get: function () {
            var _this = this;
            return util_1.mapEach(this.n, function (r) {
                var offset = r * _this.m;
                var s = util_1.mapEach(_this.m, function (c) { return _this.a[offset + c].toFixed(1); });
                return "|" + s.join(', ') + "|\n";
            }).join('');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "inverse", {
        /**
         * inverse of the matrix
         * the matrix should be square matrix
         * if it is a singular matrix, `undefined` returned
         */
        get: function () {
            if (!this.isSquare) {
                throw new TypeError('Not a square matrix');
            }
            var t = Matrix.from(this); // calculate with copy
            var n = t.n; // shortcut
            var r = Matrix.unit(n);
            var _loop_1 = function (i) {
                // i-th round make this[i][i] to 1 and this[x][i] to 0
                // 0 row to i - 1 row should satisfy this
                // find a row with this[j][i] !== 0 to be new i-th row
                // this ensures this[i][i] !== 0
                // if all this[j][i] === 0, no solution
                var noSolution = true;
                for (var j = i; j < n; ++j) {
                    if (util_1.notZero(t.at(j, i))) {
                        noSolution = false;
                        t.swapRow(i, j);
                        r.swapRow(i, j);
                        break;
                    }
                }
                if (noSolution) {
                    return { value: undefined };
                }
                // make all this[j][i] to 0
                var scalar = 1.0 / t.at(i, i);
                for (var j = 0; j < n; ++j) {
                    t.replace(i, j, function (x) { return x * scalar; });
                    r.replace(i, j, function (x) { return x * scalar; });
                }
                var _loop_2 = function (j) {
                    if (i === j) {
                        return "continue";
                    }
                    // row[j] -= row[i]
                    var scalar_1 = t.at(j, i);
                    var _loop_3 = function (k) {
                        t.replace(j, k, function (x) { return x - t.at(i, k) * scalar_1; });
                        r.replace(j, k, function (x) { return x - r.at(i, k) * scalar_1; });
                    };
                    for (var k = 0; k < n; ++k) {
                        _loop_3(k);
                    }
                };
                for (var j = 0; j < n; ++j) {
                    _loop_2(j);
                }
            };
            for (var i = 0; i < n; ++i) {
                var state_1 = _loop_1(i);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return r;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "integerInverse", {
        /**
         * inverse of the matrix, integer version
         * the matrix should be square matrix
         * if it is a singular matrix, `undefined` returned
         * the returned matrix will be all integer, which can be obtained by inverse matrix with an integer scalar
         * multiply the returned matrix will result in an integer-scalar-scaled unit matrix
         * like adjugate matrix, but calculated in inverse way
         */
        get: function () {
            if (!this.isSquare) {
                throw new TypeError('Not a square matrix');
            }
            var t = Matrix.from(this); // calculate with copy
            var n = t.n; // shortcut
            var r = Matrix.unit(n);
            var reduceRow = function (i) {
                // divide gcd of row[i] of two matrix
                var reducer = ~~Math.abs(util_1.gcd(util_1.gcd.apply(void 0, [].slice.call(t.row(i))), util_1.gcd.apply(void 0, [].slice.call(r.row(i)))));
                t = t.rowDivide(i, reducer);
                r = r.rowDivide(i, reducer);
            };
            var reduce = function () {
                for (var i = 0; i < n; ++i)
                    reduceRow(i);
            };
            var _loop_4 = function (i) {
                // i-th round make this[i][i] to 1 and this[x][i] to 0
                // 0 row to i - 1 row should satisfy this
                // find a row with this[j][i] !== 0 to be new i-th row
                // this ensures this[i][i] !== 0
                // if all this[j][i] === 0, no solution
                var noSolution = true;
                for (var j = i; j < n; ++j) {
                    if (util_1.notZero(t.at(j, i))) {
                        noSolution = false;
                        t.swapRow(i, j);
                        r.swapRow(i, j);
                        break;
                    }
                }
                if (noSolution) {
                    return { value: undefined };
                }
                var _loop_6 = function (j) {
                    if (i === j) {
                        return "continue";
                    }
                    // row[j] -= row[i]
                    var l_1 = util_1.lcm(t.at(i, i), t.at(j, i));
                    var scalarI = l_1 / t.at(i, i);
                    var scalarJ = l_1 / t.at(j, i);
                    var _loop_7 = function (k) {
                        t.replace(j, k, function (x) { return x * scalarJ - t.at(i, k) * scalarI; });
                        r.replace(j, k, function (x) { return x * scalarJ - r.at(i, k) * scalarI; });
                    };
                    for (var k = 0; k < n; ++k) {
                        _loop_7(k);
                    }
                };
                // make all this[j][i] to 0
                for (var j = 0; j < n; ++j) {
                    _loop_6(j);
                }
                reduce();
            };
            for (var i = 0; i < n; ++i) {
                var state_2 = _loop_4(i);
                if (typeof state_2 === "object")
                    return state_2.value;
            }
            // make all this[i][i] to the same
            var l = ~~Math.abs(util_1.lcm.apply(void 0, util_1.mapEach(n, function (i) { return t.at(i, i); })));
            var _loop_5 = function (i) {
                var scalar = ~~(l / t.at(i, i));
                for (var j = 0; j < n; ++j) {
                    t.replace(i, j, function (x) { return x * scalar; });
                    r.replace(i, j, function (x) { return x * scalar; });
                }
            };
            for (var i = 0; i < n; ++i) {
                _loop_5(i);
            }
            return r;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * return a unit matrix with `size` rows and columns
     */
    Matrix.unit = function (size) {
        var m = new Matrix(size, size);
        for (var i = 0; i < size; ++i) {
            m.change(i, i, 1);
        }
        return m;
    };
    Matrix.from = function (x) {
        if (x instanceof Matrix) {
            return this.fromMatrix(x);
        }
        else {
            return this.fromTwoDimArray(x);
        }
    };
    Matrix.fromTwoDimArray = function (arr) {
        var n = arr.length;
        if (n === 0) {
            throw new TypeError('Should have at least one row');
        }
        var m = arr[0].length;
        for (var i = 0; i < n; ++i) {
            if (arr[i].length !== m) {
                throw new TypeError('All row should have same columns');
            }
        }
        var r = new Matrix(n, m);
        for (var i = 0; i < n; ++i) {
            for (var j = 0; j < m; ++j) {
                var t = arr[i][j];
                if (typeof t === 'number') {
                    r.change(i, j, t);
                }
                else {
                    r.change(i, j, parseFloat(t));
                }
            }
        }
        return r;
    };
    Matrix.fromMatrix = function (o) {
        var r = new Matrix(o.rows, o.cols);
        for (var i = 0; i < o.rows; ++i) {
            for (var j = 0; j < o.cols; ++j) {
                r.change(i, j, o.at(i, j));
            }
        }
        return r;
    };
    /**
     * get row `r`
     */
    Matrix.prototype.row = function (r) {
        this.rowsCheck(r);
        return this.a.slice(r * this.m, (r + 1) * this.m);
    };
    /**
     * get column `c`
     */
    Matrix.prototype.col = function (c) {
        var _this = this;
        this.colsCheck(c);
        return new Float64Array(this.n).map(function (_, i) { return _this.a[i * _this.m + c]; });
    };
    /**
     * get an element by row number and column number
     */
    Matrix.prototype.at = function (r, c) {
        this.rangeCheck(r, c);
        return this.a[r * this.cols + c];
    };
    /**
     * shortcut for `at` method
     * get an element by row number and column number
     */
    Matrix.prototype._ = function (r, c) {
        return this.at(r, c);
    };
    /**
     * change an element by row number and column number
     */
    Matrix.prototype.change = function (r, c, newVal) {
        this.rangeCheck(r, c);
        return this.a[r * this.cols + c] = newVal;
    };
    /**
     * shortcut for `change` method
     * change an element by row number and column number
     */
    Matrix.prototype.$ = function (r, c, newVal) {
        return this.change(r, c, newVal);
    };
    /**
     * replace an element by row number and column number
     */
    Matrix.prototype.replace = function (r, c, func) {
        this.rangeCheck(r, c);
        var i = r * this.cols + c;
        return this.a[i] = func(this.a[i]);
    };
    /**
     * shortcut for `replace` method
     * replace an element by row number and column number
     */
    Matrix.prototype.$$ = function (r, c, func) {
        return this.replace(r, c, func);
    };
    /**
     * swap row `i` and row `j`
     */
    Matrix.prototype.swapRow = function (i, j) {
        var _a;
        if (i === j) {
            return;
        }
        var I = i * this.m;
        var J = j * this.m;
        for (var k = 0; k < this.m; ++k) {
            _a = [this.a[J + k], this.a[I + k]], this.a[I + k] = _a[0], this.a[J + k] = _a[1];
        }
    };
    Matrix.prototype.multiply = function (x) {
        if (typeof x === 'number') {
            return this.multiplyScalar(x);
        }
        else {
            return this.multiplyMatrix(x);
        }
    };
    Matrix.prototype.multiplyScalar = function (x) {
        var r = Matrix.from(this);
        for (var i = 0; i < this.n; ++i) {
            for (var j = 0; j < this.m; ++j) {
                r.replace(i, j, function (t) { return t * x; });
            }
        }
        return r;
    };
    Matrix.prototype.multiplyMatrix = function (x) {
        var _this = this;
        if (this.m !== x.rows) {
            throw new TypeError('Excepted left-side columns number equal to right-side row number');
        }
        var r = new Matrix(this.n, x.cols);
        var _loop_8 = function (i) {
            var _loop_9 = function (j) {
                var _loop_10 = function (k) {
                    r.replace(i, j, function (t) { return t + _this.at(i, k) * x.at(k, j); });
                };
                for (var k = 0; k < this_1.m; ++k) {
                    _loop_10(k);
                }
            };
            for (var j = 0; j < x.cols; ++j) {
                _loop_9(j);
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.n; ++i) {
            _loop_8(i);
        }
        return r;
    };
    Matrix.prototype.divide = function (x) {
        if (!util_1.notZero(x)) {
            throw new EvalError('Divided by zero');
        }
        var r = Matrix.from(this);
        for (var i = 0; i < this.n; ++i) {
            for (var j = 0; j < this.m; ++j) {
                r.replace(i, j, function (t) { return t / x; });
            }
        }
        return r;
    };
    Matrix.prototype.rowDivide = function (i, x) {
        if (!util_1.notZero(x)) {
            throw new EvalError('Divided by zero');
        }
        var r = Matrix.from(this);
        for (var j = 0; j < this.m; ++j) {
            r.replace(i, j, function (t) { return t / x; });
        }
        return r;
    };
    /**
     * check whether row number is valid
     */
    Matrix.prototype.rowsCheck = function (r) {
        if (r < 0 || r > this.n) {
            throw new RangeError("Expected row between 0-" + this.n + " but got " + r);
        }
    };
    /**
     * check whether col number is valid
     */
    Matrix.prototype.colsCheck = function (c) {
        if (c < 0 || c > this.m) {
            throw new RangeError("Expected col between 0-" + this.m + " but got " + c);
        }
    };
    /**
     * check whether row number and col number are valid
     */
    Matrix.prototype.rangeCheck = function (r, c) {
        this.rowsCheck(r);
        this.colsCheck(c);
    };
    return Matrix;
}());
exports.default = Matrix;
//# sourceMappingURL=matrix.js.map