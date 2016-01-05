System.register(["../util/util", "../shader/Shader", "../cpu/Thread", "../worker/RayWorker"], function(exports_1) {
    var util_1, Shader_1, Thread_1, RayWorker_1;
    var RayJob;
    return {
        setters:[
            function (util_1_1) {
                util_1 = util_1_1;
            },
            function (Shader_1_1) {
                Shader_1 = Shader_1_1;
            },
            function (Thread_1_1) {
                Thread_1 = Thread_1_1;
            },
            function (RayWorker_1_1) {
                RayWorker_1 = RayWorker_1_1;
            }],
        execute: function() {
            RayJob = (function () {
                function RayJob(pixelMemory, width, height, xoffset, yoffset, id, tracer) {
                    this.pixelMemory = pixelMemory;
                    this.width = width;
                    this.height = height;
                    this.xoffset = xoffset;
                    this.yoffset = yoffset;
                    this.id = id;
                    this.finished = true;
                    this.tracer = tracer;
                    this.thread = new Thread_1.Thread("Worker: " + id);
                    this.thread.onInitComplete = function () {
                    };
                    this.thread.onTraceComplete = function (buffer) {
                        pixelMemory.buffer = buffer;
                    };
                    this.thread.sendCommand(RayWorker_1.RayWorker.INIT);
                    this.thread.sendData({
                        window_width: util_1.Config.window_width,
                        window_height: util_1.Config.window_height,
                        width: width,
                        height: height,
                        xoffset: xoffset,
                        yoffset: yoffset,
                        tracer: this.tracer
                    });
                }
                RayJob.prototype.run = function () {
                    this.finished = false;
                    if (this.thread.traced) {
                        return;
                    }
                    if (this.thread.initialized && !this.thread.isTracing) {
                        this.thread.trace();
                        var buffer = new ArrayBuffer(this.pixelMemory.length);
                        this.thread.sendData({ buffer: buffer, ar: this.display.getAR() }, [buffer]);
                    }
                    this.finished = true;
                };
                RayJob.traceColor = function (ray, scene, n) {
                    if (n > util_1.Config.recursion_max)
                        return Shader_1.Shader.COLOR_NULL;
                    var xInit = null;
                    var xFinal = null;
                    var xObject = null;
                    var tInit = Number.MAX_VALUE;
                    scene.getObjects().forEach(function (obj) {
                        obj.getPrimitives().forEach(function (primitive) {
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
                    scene.getLights().forEach(function (light) {
                        cFinal.set(cFinal.add(Shader_1.Shader.main(ray, xFinal, light, xObject.getMaterial())));
                        var ray_shadow = null;
                        if (xObject.getMaterial().getReflectivity() != 1.0) {
                            var L_Vector = light.getPos().sub(xFinal.getPos());
                            var L_length = L_Vector.length();
                            if (light.getLightType() == util_1.light_types.DIRECTIONAL) {
                                ray_shadow = new util_1.Ray(xFinal.getPos(), light.getDir().negate());
                                L_length = Number.MAX_VALUE;
                            }
                            else if (light.getLightType() == util_1.light_types.POINT) {
                                ray_shadow = new util_1.Ray(xFinal.getPos(), L_Vector);
                            }
                            if (ray_shadow != null) {
                                cFinal.set(cFinal.scale(Math.min(RayJob.traceShadow(ray_shadow, scene, xObject, L_length) + xObject.getMaterial().getReflectivity(), 1.0)));
                            }
                        }
                    });
                    if (xObject.getMaterial().getReflectivity() > 0.0) {
                        var ray_reflected = new util_1.Ray(xFinal.getPos(), ray.getDir().reflect(xFinal.getNorm()));
                        cFinal.set(cFinal.add(RayJob.traceColor(ray_reflected, scene, n + 1).scale(xObject.getMaterial().getReflectivity())));
                    }
                    if (xObject.getMaterial().getRefractivity() > 0.0) {
                        var ray_refracted;
                        var N = xFinal.getNorm();
                        var NdotI = ray.getDir().dot(N), ior, n1, n2, cos_t;
                        if (NdotI > 0.0) {
                            n1 = ray.getIOR();
                            n2 = xObject.getMaterial().getIOR();
                            N = N.negate();
                        }
                        else {
                            n1 = xObject.getMaterial().getIOR();
                            n2 = ray.getIOR();
                            NdotI = -NdotI;
                        }
                        ior = n2 / n1;
                        cos_t = ior * ior * (1.0 - NdotI * NdotI);
                        ray_refracted = new util_1.Ray(xFinal.getPos(), ray.getDir().refract(N, ior, NdotI, cos_t), 1.0);
                        cFinal.set(cFinal.add(RayJob.traceColor(ray_refracted, scene, n + 1).scale(xObject.getMaterial().getRefractivity())));
                    }
                    cFinal.set(cFinal.add(xObject.getMaterial().getColorAmbient()));
                    return util_1.MathUtils.clamp(cFinal, 0.0, 1.0);
                };
                RayJob.traceShadow = function (ray, s, thisobj, L_length) {
                    var xInit = null;
                    var xFinal = null;
                    var xObject = null;
                    var tInit = Number.MAX_VALUE;
                    var weight = 1.0;
                    s.getObjects().forEach(function (obj) {
                        if (obj === thisobj) {
                            return;
                        }
                        obj.getPrimitives().forEach(function (primitive) {
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
                    if (xObject.getMaterial().getReflectivity() > 0.0) {
                        weight -= xObject.getMaterial().getReflectivity();
                    }
                    if (xObject.getMaterial().getRefractivity() > 0.0) {
                        weight *= xObject.getMaterial().getRefractivity();
                    }
                    return weight;
                };
                RayJob.prototype.getWidth = function () {
                    return this.width;
                };
                RayJob.prototype.getHeight = function () {
                    return this.height;
                };
                RayJob.prototype.getXOffset = function () {
                    return this.xoffset;
                };
                RayJob.prototype.getYOffset = function () {
                    return this.yoffset;
                };
                RayJob.prototype.getId = function () {
                    return this.id;
                };
                RayJob.prototype.isFinished = function () {
                    return this.finished;
                };
                RayJob.prototype.setDisplay = function (display) {
                    this.display = display;
                };
                return RayJob;
            })();
            exports_1("RayJob", RayJob);
        }
    }
});
//# sourceMappingURL=RayJob.js.map