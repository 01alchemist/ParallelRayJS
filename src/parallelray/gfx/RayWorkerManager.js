System.register(["../util/Config", "./RayJob"], function(exports_1) {
    var Config_1, RayJob_1;
    var SharedArrayBuffer, RayWorkerManager;
    return {
        setters:[
            function (Config_1_1) {
                Config_1 = Config_1_1;
            },
            function (RayJob_1_1) {
                RayJob_1 = RayJob_1_1;
            }],
        execute: function() {
            exports_1("SharedArrayBuffer", SharedArrayBuffer = SharedArrayBuffer || ArrayBuffer);
            RayWorkerManager = (function () {
                function RayWorkerManager(tracer) {
                    this.tracer = tracer;
                    this.propertySize = 512;
                    var width = Config_1.Config.window_width;
                    var height = Config_1.Config.window_height;
                    this.propertyMemory = new Uint8Array(new SharedArrayBuffer(this.propertySize));
                    this.pixelMemory = new Uint8Array(new SharedArrayBuffer(width * height * 4));
                    this.jobs = [];
                    this.setWorkerAmount(Config_1.Config.thread_amount);
                }
                Object.defineProperty(RayWorkerManager.prototype, "numWorkers", {
                    get: function () {
                        return this.jobs.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RayWorkerManager.prototype, "pixels", {
                    get: function () {
                        return this.pixelMemory;
                    },
                    enumerable: true,
                    configurable: true
                });
                RayWorkerManager.prototype.setWorkerAmount = function (n) {
                    if (n <= 0) {
                        n = navigator["hardwareConcurrency"] || 2;
                    }
                    n = -1;
                    n = n > 2 ? 2 : n;
                    console.info("hardwareConcurrency:" + n);
                    this.jobs = [];
                    var width = Config_1.Config.window_width;
                    var height = Config_1.Config.window_height;
                    if (n > 1) {
                        width /= n;
                        height /= n;
                        for (var j = 0; j < n; j++) {
                            for (var i = 0; i < n; i++) {
                                this.jobs.push(new RayJob_1.RayJob(this.pixelMemory, width, height, i * width, j * height, i + j * width, this.tracer));
                            }
                        }
                    }
                    else {
                        this.jobs.push(new RayJob_1.RayJob(this.pixelMemory, width, height, 0, 0, 0, this.tracer));
                    }
                };
                RayWorkerManager.prototype.start = function (display) {
                    console.log("start");
                    this.jobs.forEach(function (w) {
                        w.setDisplay(display);
                    });
                };
                RayWorkerManager.prototype.render = function () {
                    if (this.workersFinished()) {
                        this.jobs.forEach(function (w) {
                            w.run();
                        });
                    }
                };
                RayWorkerManager.prototype.workersFinished = function () {
                    var isAllFinished = true;
                    this.jobs.forEach(function (w) {
                        if (!w.isFinished()) {
                            isAllFinished = false;
                        }
                    });
                    return isAllFinished;
                };
                return RayWorkerManager;
            })();
            exports_1("RayWorkerManager", RayWorkerManager);
        }
    }
});
//# sourceMappingURL=RayWorkerManager.js.map