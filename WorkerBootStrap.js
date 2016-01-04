importScripts(
    "node_modules/systemjs/dist/system.src.js"
);

System.config({
    packages: {
        "src/parallelray": {
            format: 'register',
            defaultExtension: 'js'
        }
    }
});
//System.import('src/parallelray/worker/RayWorker').then(function(m) {
System.import('src/parallelray/worker/RayWorker').then(null, console.error.bind(console));