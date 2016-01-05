System.register(["../util/math/MathUtils"], function(exports_1) {
    var MathUtils_1;
    var Display;
    return {
        setters:[
            function (MathUtils_1_1) {
                MathUtils_1 = MathUtils_1_1;
            }],
        execute: function() {
            Display = (function () {
                function Display(width, height, scale, title) {
                    this.title = title;
                    this.width = width;
                    this.height = height;
                    this.scale = scale;
                }
                Display.prototype.create = function () {
                    if (this.image == null) {
                        this.image = new ImageData(this.width, this.height);
                        this.pixels = this.image.data;
                        this.clear();
                    }
                    this.info = document.getElementById("info");
                    this.canvas = document.getElementById("viewport");
                    this.ctx = this.canvas.getContext("2d");
                    this.ctx.putImageData(this.image, 0, 0);
                    if (this.bufferstrategy == null) {
                    }
                };
                Display.prototype.render = function (_pixels) {
                    for (var x = 0; x < this.width; x++) {
                        for (var y = 0; y < this.height; y++) {
                            var index = ((y * (this.width * 4)) + (x * 4));
                            this.image.data[index] = _pixels[index];
                            this.image.data[index + 1] = _pixels[index + 1];
                            this.image.data[index + 2] = _pixels[index + 2];
                            this.image.data[index + 3] = _pixels[index + 3];
                        }
                    }
                    this.ctx.putImageData(this.image, 0, 0);
                    this.ctx.fillRect(Math.random() * 100, Math.random() * 100, 10, 10);
                };
                Display.prototype.clear = function () {
                };
                Display.prototype.drawPixelVec3f = function (x, y, v) {
                    if (x < 0 || x > this.width || y < 0 || y > this.height)
                        return;
                    v = MathUtils_1.MathUtils.smoothstep(MathUtils_1.MathUtils.clamp(v, 0.0, 1.0), 0.0, 1.0);
                    var index = ((y * (this.width * 4)) + (x * 4));
                    var red = (v.x * 255.0);
                    var green = (v.y * 255.0);
                    var blue = (v.z * 255.0);
                    this.pixels[index] = red;
                    this.pixels[index + 1] = green;
                    this.pixels[index + 2] = blue;
                    this.pixels[index + 3] = 255;
                };
                Display.prototype.drawPixelInt = function (x, y, color) {
                    if (x < 0 || x >= this.width || y < 0 || y >= this.height)
                        return;
                    var index = ((y * (this.width * 4)) + (x * 4));
                    var red = (color >> 16) & 255;
                    var green = (color >> 8) & 255;
                    var blue = color & 255;
                    this.pixels[index] = red;
                    this.pixels[index + 1] = green;
                    this.pixels[index + 2] = blue;
                    this.pixels[index + 3] = 255;
                };
                Display.prototype.saveBitmapToFile = function (fileName) {
                };
                Display.prototype.getWidth = function () {
                    return this.width;
                };
                Display.prototype.getHeight = function () {
                    return this.height;
                };
                Display.prototype.getPixels = function () {
                    return this.pixels;
                };
                Display.prototype.getImage = function () {
                    return this.image;
                };
                Display.prototype.getDimension = function () {
                    return this.dimension;
                };
                Display.prototype.get2dContex = function () {
                    return this.ctx;
                };
                Display.prototype.getAR = function () {
                    return this.width / this.height;
                };
                Display.prototype.getScale = function () {
                    return this.scale;
                };
                Display.prototype.setTitle = function (title) {
                    this.info.innerHTML = this.title + " | " + title;
                };
                Display.prototype.setWidth = function (width) {
                    this.width = width;
                };
                Display.prototype.setHeight = function (height) {
                    this.height = height;
                };
                Display.prototype.setPixels = function (pixels) {
                    this.pixels = pixels;
                };
                Display.prototype.setImage = function (image) {
                    this.image = image;
                };
                Display.prototype.setDimension = function (dimension) {
                    this.dimension = dimension;
                };
                Display.prototype.setScale = function (scale) {
                    this.scale = scale;
                };
                Display.serialVersionUID = 1;
                return Display;
            })();
            exports_1("Display", Display);
        }
    }
});
//# sourceMappingURL=Display.js.map