System.register(["../gfx/gfx", "../util/util", "../shader/Shader", "../util/math/Plane", "../util/math/Sphere", "../gfx/Camera"], function(exports_1) {
    var gfx_1, util_1, Shader_1, Plane_1, Sphere_1, Camera_1;
    var RayWorker;
    return {
        setters:[
            function (gfx_1_1) {
                gfx_1 = gfx_1_1;
            },
            function (util_1_1) {
                util_1 = util_1_1;
            },
            function (Shader_1_1) {
                Shader_1 = Shader_1_1;
            },
            function (Plane_1_1) {
                Plane_1 = Plane_1_1;
            },
            function (Sphere_1_1) {
                Sphere_1 = Sphere_1_1;
            },
            function (Camera_1_1) {
                Camera_1 = Camera_1_1;
            }],
        execute: function() {
            RayWorker = (function () {
                function RayWorker() {
                    var self = this;
                    addEventListener('message', function (e) {
                        if (self.command == null) {
                            self.command = e.data;
                        }
                        else if (self.command == RayWorker.INIT) {
                            self.command = null;
                            postMessage(RayWorker.INITED);
                            self.tracer = e.data.tracer;
                            self.tracer.scene.objects.forEach(function (obj) {
                                obj.primitives.forEach(function (primitive, index) {
                                    primitive = primitive.type == "plane" ? Plane_1.Plane.cast(primitive) : Sphere_1.Sphere.cast(primitive);
                                    obj.primitives[index] = primitive;
                                });
                            });
                            self.tracer.camera = Camera_1.Camera.cast(self.tracer.camera);
                            self.tracer.scene.lights.forEach(function (light, index) {
                                self.tracer.scene.lights[index] = gfx_1.Light.cast(light);
                            });
                            self.window_width = e.data.window_width;
                            self.window_height = e.data.window_height;
                            self.init(e.data.width, e.data.height, e.data.xoffset, e.data.yoffset, e.data.id);
                        }
                        else if (self.command == RayWorker.TRACE) {
                            self.command = null;
                            self.ar = e.data.ar;
                            if (!self.pixelMemory) {
                                self.pixelMemory = new Uint8Array(e.data.buffer);
                            }
                            else {
                                self.pixelMemory.buffer = e.data.buffer;
                            }
                            self.run();
                            postMessage(RayWorker.TRACED);
                            postMessage(self.pixelMemory.buffer, [self.pixelMemory.buffer]);
                        }
                    }, false);
                }
                RayWorker.prototype.init = function (width, height, xoffset, yoffset, id) {
                    this.width = width;
                    this.height = height;
                    this.xoffset = xoffset;
                    this.yoffset = yoffset;
                    this.id = id;
                    this.finished = true;
                };
                RayWorker.prototype.run = function () {
                    this.finished = false;
                    if (this.tracer != null) {
                        var width = this.window_width;
                        var height = this.window_height;
                        var ray_primary = new util_1.Ray();
                        for (var y = this.yoffset; y < this.yoffset + this.height; y++) {
                            for (var x = this.xoffset; x < this.xoffset + this.width; x++) {
                                ray_primary = util_1.Ray.calcCameraRay(this.tracer.camera, width, height, this.ar, x, y);
                                this.drawPixelVec3f(x, y, RayWorker.traceColor(ray_primary, this.tracer.scene, 0));
                                if (util_1.Config.debug && x == this.xoffset + 1 || util_1.Config.debug && y == this.yoffset) {
                                    this.drawPixelInt(x, y, 0xFFFF00F);
                                }
                            }
                        }
                    }
                    this.finished = true;
                };
                RayWorker.prototype.drawPixelVec3f = function (x, y, color) {
                    if (x < 0 || x > this.width || y < 0 || y > this.height)
                        return;
                    color = util_1.MathUtils.smoothstep(util_1.MathUtils.clamp(color, 0.0, 1.0), 0.0, 1.0);
                    var index = ((y * (this.width * 4)) + (x * 4));
                    var red = (color.x * 255.0);
                    var green = (color.y * 255.0);
                    var blue = (color.z * 255.0);
                    this.pixelMemory[index] = red;
                    this.pixelMemory[index + 1] = green;
                    this.pixelMemory[index + 2] = blue;
                    this.pixelMemory[index + 3] = 255;
                };
                RayWorker.prototype.drawPixelInt = function (x, y, color) {
                    if (x < 0 || x >= this.width || y < 0 || y >= this.height)
                        return;
                    var index = ((y * (this.width * 4)) + (x * 4));
                    var red = (color >> 16) & 255;
                    var green = (color >> 8) & 255;
                    var blue = color & 255;
                    this.pixelMemory[index] = red;
                    this.pixelMemory[index + 1] = green;
                    this.pixelMemory[index + 2] = blue;
                    this.pixelMemory[index + 3] = 255;
                };
                RayWorker.traceColor = function (ray, scene, n) {
                    if (n > util_1.Config.recursion_max)
                        return Shader_1.Shader.COLOR_NULL;
                    var xInit = null;
                    var xFinal = null;
                    var xObject = null;
                    var tInit = Number.MAX_VALUE;
                    scene.objects.forEach(function (obj) {
                        obj.primitives.forEach(function (primitive) {
                            xInit = primitive.intersect(ray);
                            if (xInit != null && xInit.getT() < tInit) {
                                xFinal = xInit;
                                tInit = xFinal.getT();
                                xObject = obj;
                            }
                        });
                    });
                    if (xFinal == null)
                        return Shader_1.Shader.COLOR_NULL;
                    var cFinal = new util_1.Vec3f();
                    scene.lights.forEach(function (light) {
                        cFinal.set(cFinal.add(Shader_1.Shader.main(ray, xFinal, light, xObject.material)));
                        var ray_shadow = null;
                        if (xObject.material.reflectivity != 1.0) {
                            var L_Vector = light.pos.sub(xFinal.pos);
                            var L_length = L_Vector.length();
                            if (light.getLightType() == util_1.light_types.DIRECTIONAL) {
                                ray_shadow = new util_1.Ray(xFinal.getPos(), light.getDir().negate());
                                L_length = Number.MAX_VALUE;
                            }
                            else if (light.getLightType() == util_1.light_types.POINT) {
                                ray_shadow = new util_1.Ray(xFinal.getPos(), L_Vector);
                            }
                            if (ray_shadow != null) {
                                cFinal.set(cFinal.scale(Math.min(RayWorker.traceShadow(ray_shadow, scene, xObject, L_length) + xObject.material.reflectivity, 1.0)));
                            }
                        }
                    });
                    if (xObject.material.reflectivity > 0.0) {
                        var ray_reflected = new util_1.Ray(xFinal.getPos(), ray.getDir().reflect(xFinal.getNorm()));
                        cFinal.set(cFinal.add(RayWorker.traceColor(ray_reflected, scene, n + 1).scale(xObject.material.reflectivity)));
                    }
                    if (xObject.material.refractivity > 0.0) {
                        var ray_refracted;
                        var N = xFinal.getNorm();
                        var NdotI = ray.getDir().dot(N), ior, n1, n2, cos_t;
                        if (NdotI > 0.0) {
                            n1 = ray.getIOR();
                            n2 = xObject.material.ior;
                            N = N.negate();
                        }
                        else {
                            n1 = xObject.material.ior;
                            n2 = ray.getIOR();
                            NdotI = -NdotI;
                        }
                        ior = n2 / n1;
                        cos_t = ior * ior * (1.0 - NdotI * NdotI);
                        ray_refracted = new util_1.Ray(xFinal.getPos(), ray.getDir().refract(N, ior, NdotI, cos_t), 1.0);
                        cFinal.set(cFinal.add(RayWorker.traceColor(ray_refracted, scene, n + 1).scale(xObject.material.refractivity)));
                    }
                    cFinal.set(cFinal.add(xObject.material.color_ambient));
                    return util_1.MathUtils.clamp(cFinal, 0.0, 1.0);
                };
                RayWorker.traceShadow = function (ray, s, thisobj, L_length) {
                    var xInit = null;
                    var xFinal = null;
                    var xObject = null;
                    var tInit = Number.MAX_VALUE;
                    var weight = 1.0;
                    s.objects.forEach(function (obj) {
                        if (obj === thisobj) {
                            return;
                        }
                        obj.primitives.forEach(function (primitive) {
                            xInit = primitive.intersect(ray);
                            if (xInit != null && xInit.getT() < tInit && xInit.getT() < L_length) {
                                xFinal = xInit;
                                tInit = xFinal.getT();
                                xObject = obj;
                            }
                        });
                    });
                    if (xFinal == null) {
                        return 1.0;
                    }
                    if (xObject.material.reflectivity > 0.0) {
                        weight -= xObject.material.reflectivity;
                    }
                    if (xObject.material.refractivity > 0.0) {
                        weight *= xObject.material.refractivity;
                    }
                    return weight;
                };
                RayWorker.prototype.getWidth = function () {
                    return this.width;
                };
                RayWorker.prototype.getHeight = function () {
                    return this.height;
                };
                RayWorker.prototype.getXOffset = function () {
                    return this.xoffset;
                };
                RayWorker.prototype.getYOffset = function () {
                    return this.yoffset;
                };
                RayWorker.prototype.getId = function () {
                    return this.id;
                };
                RayWorker.prototype.isFinished = function () {
                    return this.finished;
                };
                RayWorker.INIT = "INIT";
                RayWorker.INITED = "INITED";
                RayWorker.TRACE = "TRACE";
                RayWorker.TRACED = "TRACED";
                return RayWorker;
            })();
            exports_1("RayWorker", RayWorker);
            new RayWorker();
        }
    }
});
//# sourceMappingURL=RayWorker.js.map