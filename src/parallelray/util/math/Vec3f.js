System.register([], function(exports_1) {
    var Vec3f;
    return {
        setters:[],
        execute: function() {
            Vec3f = (function () {
                function Vec3f(x, y, z) {
                    x = x || 0;
                    y = y || x;
                    z = z || x;
                    this.x = x;
                    this.y = y;
                    this.z = z;
                }
                Vec3f.prototype._isThis = function (value) {
                    return value instanceof Object || value instanceof Vec3f;
                };
                Vec3f.prototype.toString = function () {
                    return "Vec3f[" + this.x + "," + this.y + "," + this.z + "]";
                };
                Vec3f.prototype.equals = function (v) {
                    return (this.x == v.x && this.y == v.y && this.z == v.z);
                };
                Vec3f.prototype.set = function (x, y, z) {
                    var v = this._isThis(x) ? x : null;
                    if (v) {
                        this.x = v.x;
                        this.y = v.y;
                        this.z = v.z;
                    }
                    else {
                        this.x = x;
                        this.y = y;
                        this.z = z;
                    }
                    return this;
                };
                Vec3f.prototype.add = function (value) {
                    var v = this._isThis(value) ? value : null;
                    if (v) {
                        return new Vec3f(this.x + v.x, this.y + v.y, this.z + v.z);
                    }
                    else {
                        var f = value;
                        return new Vec3f(this.x + f, this.y + f, this.z + f);
                    }
                };
                Vec3f.prototype.sub = function (value) {
                    var v = this._isThis(value) ? value : null;
                    if (v) {
                        return new Vec3f(this.x - v.x, this.y - v.y, this.z - v.z);
                    }
                    else {
                        var f = value;
                        return new Vec3f(this.x - f, this.y - f, this.z - f);
                    }
                };
                Vec3f.prototype.scale = function (value) {
                    var v = this._isThis(value) ? value : null;
                    if (v) {
                        return new Vec3f(this.x * v.x, this.y * v.y, this.z * v.z);
                    }
                    else {
                        var f = value;
                        return new Vec3f(this.x * f, this.y * f, this.z * f);
                    }
                };
                Vec3f.prototype.divide = function (value) {
                    var v = this._isThis(value) ? value : null;
                    if (v) {
                        return new Vec3f(this.x / v.x, this.y / v.y, this.z / v.z);
                    }
                    else {
                        var f = value;
                        return new Vec3f(this.x / f, this.y / f, this.z / f);
                    }
                };
                Vec3f.prototype.cross = function (v) {
                    var x = this.y * v.z - v.y * this.z;
                    var y = this.z * v.x - v.z * this.x;
                    var z = this.x * v.y - v.x * this.y;
                    return new Vec3f(x, y, z);
                };
                Vec3f.prototype.dot = function (v) {
                    return this.x * v.x + this.y * v.y + this.z * v.z;
                };
                Vec3f.prototype.mul = function (q) {
                    var q_inv = q.conjugate();
                    var w = q.mul(this).mul(q_inv);
                    return new Vec3f(w.x, w.y, w.z);
                };
                Vec3f.prototype.length = function () {
                    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
                };
                Vec3f.prototype.normalize = function () {
                    var length = this.length();
                    return new Vec3f(this.x / length, this.y / length, this.z / length);
                };
                Vec3f.prototype.negate = function () {
                    return new Vec3f(-this.x, -this.y, -this.z);
                };
                Vec3f.prototype.reflect = function (N) {
                    return this.sub(N.scale(N.dot(this)).scale(2.0));
                };
                Vec3f.prototype.refract = function (N, n, NdotI, cos_t) {
                    cos_t = Math.sqrt(1.0 - cos_t);
                    if (cos_t < 1.0)
                        return this.scale(n).add(N.scale(n * NdotI - cos_t));
                    else
                        return this.reflect(N);
                };
                Vec3f.prototype.getComponent = function (i, w) {
                    if (i == 0)
                        return this.x;
                    else if (i == 1)
                        return this.y;
                    else if (i == 2)
                        return this.z;
                    else if (i == 3)
                        return w;
                    else
                        return 0.0;
                };
                Vec3f.prototype.setComponent = function (i, value) {
                    if (i == 0)
                        this.x = value;
                    else if (i == 1)
                        this.y = value;
                    else if (i == 2)
                        this.z = value;
                };
                return Vec3f;
            })();
            exports_1("Vec3f", Vec3f);
        }
    }
});
//# sourceMappingURL=Vec3f.js.map