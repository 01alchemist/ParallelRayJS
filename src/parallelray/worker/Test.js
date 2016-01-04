System.register([], function(exports_1) {
    var Test;
    return {
        setters:[],
        execute: function() {
            Test = (function () {
                function Test() {
                    console.log("I am Ok");
                    postMessage("I am Ok");
                }
                return Test;
            })();
            exports_1("Test", Test);
            new Test();
        }
    }
});
//# sourceMappingURL=Test.js.map