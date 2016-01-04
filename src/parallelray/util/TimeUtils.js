System.register([], function(exports_1) {
    var TimeUtils;
    return {
        setters:[],
        execute: function() {
            TimeUtils = (function () {
                function TimeUtils() {
                }
                TimeUtils.init = function () {
                    TimeUtils.lastTime = TimeUtils.getTime();
                    TimeUtils.updateDelta();
                };
                TimeUtils.updateDelta = function () {
                    TimeUtils.currentTime = TimeUtils.getTime();
                    TimeUtils.delta = TimeUtils.delta * 0.9 + (TimeUtils.currentTime - TimeUtils.lastTime) * 0.1;
                    TimeUtils.lastTime = TimeUtils.currentTime;
                };
                TimeUtils.updateFPS = function () {
                    TimeUtils.time++;
                    if (TimeUtils.time >= TimeUtils.timeres) {
                        if (isFinite(TimeUtils.fps)) {
                            TimeUtils.fps = 0.0;
                        }
                        TimeUtils.fps = TimeUtils.fps * 0.9 + (TimeUtils.timeres / TimeUtils.delta) * 0.1;
                        TimeUtils.time -= TimeUtils.timeres;
                    }
                };
                TimeUtils.getTime = function () {
                    return performance.now() / TimeUtils.second;
                };
                TimeUtils.getDelta = function () {
                    return TimeUtils.delta;
                };
                TimeUtils.getFPS = function () {
                    return TimeUtils.frame * TimeUtils.fps;
                };
                TimeUtils.second = 1000000;
                TimeUtils.frame = 1000;
                TimeUtils.timeres = 1;
                return TimeUtils;
            })();
            exports_1("TimeUtils", TimeUtils);
        }
    }
});
//# sourceMappingURL=TimeUtils.js.map