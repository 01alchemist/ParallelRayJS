System.register(["../worker/RayWorker"], function(exports_1) {
    var RayWorker_1;
    var Thread;
    return {
        setters:[
            function (RayWorker_1_1) {
                RayWorker_1 = RayWorker_1_1;
            }],
        execute: function() {
            Thread = (function () {
                function Thread(name) {
                    this.instance = new Worker("WorkerBootstrap.js");
                    var self = this;
                    this.instance.onmessage = function (event) {
                        if (event.data == RayWorker_1.RayWorker.INITED) {
                            self.initialized = true;
                            self.isTracing = false;
                            if (self.onInitComplete) {
                                self.onInitComplete();
                            }
                        }
                        if (event.data == RayWorker_1.RayWorker.TRACED) {
                            self.command = RayWorker_1.RayWorker.TRACED;
                        }
                        else {
                            if (self.command == RayWorker_1.RayWorker.TRACED) {
                                self.command = null;
                                self.isTracing = false;
                                self.traced = true;
                                if (self.onTraceComplete) {
                                    self.onTraceComplete(event.data);
                                }
                            }
                        }
                    };
                }
                Thread.prototype.trace = function () {
                    this.isTracing = true;
                    this.instance.postMessage(RayWorker_1.RayWorker.TRACE);
                };
                Thread.prototype.sendCommand = function (message) {
                    this.instance.postMessage(message);
                };
                Thread.prototype.sendData = function (data, buffers) {
                    this.instance.postMessage(data, buffers);
                };
                return Thread;
            })();
            exports_1("Thread", Thread);
        }
    }
});
//# sourceMappingURL=Thread.js.map