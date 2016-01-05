import {Display, Tracer, Light, Scene, TracerObject} from "../gfx/gfx";
import {Config, Ray, Intersection, Primitive, Vec3f, MathUtils, light_types} from "../util/util";
import {Shader} from "../shader/Shader";
import {Plane} from "../util/math/Plane";
import {Sphere} from "../util/math/Sphere";
import {Camera} from "../gfx/Camera";
import {Material} from "../gfx/Material";

export class RayWorker
{

    static INIT:string = "INIT";
    static INITED:string = "INITED";
    static TRACE:string = "TRACE";
    static TRACED:string = "TRACED";

    private width:number;
    private height:number;
    private xoffset:number;
    private yoffset:number;
    private ar:number;
    private id:number;
    private finished:boolean;

    private tracer:Tracer;

    private command:any;
    private propertyMemory:Uint8Array;
    private pixelMemory:Uint8Array;
    private window_width:number;
    private window_height:number;

    constructor(){
        var self = this;
        addEventListener('message', (e:any) => {

            if(self.command == null){
                self.command = e.data;
            }else if(self.command == RayWorker.INIT){

                self.command = null;
                /*self.propertyMemory = new Uint8Array(e.data.propertyMemory);*/
                self.pixelMemory = new Uint8ClampedArray(e.data.pixelMemory);

                postMessage(RayWorker.INITED);

                self.tracer = e.data.tracer;

                self.tracer.camera = Camera.cast(self.tracer.camera);

                self.tracer.scene.objects.forEach(function(obj:TracerObject){
                    obj.primitives.forEach(function(primitive:Primitive, index:number){
                        primitive = primitive.type == "plane"?Plane.cast(primitive):Sphere.cast(primitive);
                        obj.primitives[index] = primitive;
                    });
                    obj.material = Material.cast(obj.material);
                });
                self.tracer.scene.lights.forEach(function(light:Light, index){
                    self.tracer.scene.lights[index] = Light.cast(light);
                });

                self.window_width = e.data.window_width;
                self.window_height = e.data.window_height;
                self.init(
                    e.data.width,
                    e.data.height,
                    e.data.xoffset,
                    e.data.yoffset,
                    e.data.id
                );

            }else if(self.command == RayWorker.TRACE){
                self.command = null;
                self.ar = e.data.ar;
                self.tracer.camera.rot.set(e.data.rot);
                self.tracer.camera.pos.set(e.data.pos);
                self.run();
                postMessage(RayWorker.TRACED);
            }
        }, false);
    }
    init(width:number, height:number, xoffset:number, yoffset:number, id:number)
    {
        this.width = width;
        this.height = height;
        this.xoffset = xoffset;
        this.yoffset = yoffset;
        this.id = id;
        this.finished = true;
        //this.tracer = tracer;
    }

    run():void
    {
        this.finished = false;
        //console.log("Traced");
        if (this.tracer != null)
        {
            var ray_primary:Ray = new Ray();
            //var ray_primary:Ray = new Ray(new Vec3f(0,1,0), new Vec3f(-0.39594, 0.22271, -0.89086), 1);
            for (var y:number = this.yoffset; y < this.yoffset + this.height; y++)
            {
                for (var x:number = this.xoffset; x < this.xoffset + this.width; x++)
                {
                    ray_primary = Ray.calcCameraRay(this.tracer.camera, this.window_width, this.window_height, this.ar, x, y);
                    //ray_primary = new Ray();

                    this.drawPixelVec3f(x, y, RayWorker.traceColor(ray_primary, this.tracer.scene, 0));
                    //this.drawPixelInt(x, y, Math.random() * 0xffffff);

                    if (Config.debug && x == this.xoffset || Config.debug && y == this.yoffset) {
                        this.drawPixelInt(x, y, 0xFFFF00F);
                    }
                }
            }
        }
        this.finished = true;
    }

    drawPixelVec3f(x:number, y:number, color:Vec3f):void{

        /*if (x < 0 || x > this.width || y < 0 || y > this.height)
            return;*/

        color = <Vec3f>MathUtils.smoothstep(MathUtils.clamp(color, 0.0, 1.0), 0.0, 1.0);

        var index:number = ((y * (this.window_width * 4)) + (x * 4));
        var red:number = (color.x * 255.0);
        var green:number = (color.y * 255.0);
        var blue:number = (color.z * 255.0);
        //var hex_value:number = ((red << 16) | (green << 8) | blue);

        this.pixelMemory[index] = red;
        this.pixelMemory[index + 1] = green;
        this.pixelMemory[index + 2] = blue;
        this.pixelMemory[index + 3] = 255;
    }

    drawPixelInt(x:number, y:number, color:number) {
        /*if (x < 0 || x >= this.width || y < 0 || y >= this.height)
            return;*/

        //this.pixels[x + y * this.width] = color;
        var index:number = ((y * (this.window_width * 4)) + (x * 4));

        var red = (color >> 16) & 255;
        var green = (color >> 8) & 255;
        var blue = color & 255;

        this.pixelMemory[index] = red;
        this.pixelMemory[index + 1] = green;
        this.pixelMemory[index + 2] = blue;
        this.pixelMemory[index + 3] = 255;
    }

    static traceColor(ray:Ray, scene:Scene, n:number):Vec3f
    {
        // Break out from the method if max recursion depth is hit
        if (n > Config.recursion_max)
            return Shader.COLOR_NULL;

        // Initialize the required intersection data
        var xInit:Intersection = null;
        var xFinal:Intersection = null;
        var xObject:TracerObject = null;
        var tInit:number = Number.MAX_VALUE;

        // Find the nearest intersection point
        scene.objects.forEach(function(obj:TracerObject){
            obj.primitives.forEach(function(primitive:Primitive){
                xInit = primitive.intersect(ray);
                if (xInit != null && xInit.getT() < tInit)
                {
                    xFinal = xInit;
                    tInit = xFinal.getT();
                    xObject = obj;
                }
            });
        });

        // Return a blank color if the ray didn't hit anything
        if (xFinal == null)
            return Shader.COLOR_RED;

        // Initialize the main color which will be calculated and returned
        var cFinal:Vec3f = new Vec3f();

        // Shade the surface point against all lights in the scene
        scene.lights.forEach(function(light:Light) {

            cFinal.set(cFinal.add(Shader.main(ray, xFinal, light, xObject.material)));

            var ray_shadow:Ray = null;

            if (xObject.material.reflectivity != 1.0)
            {
                var L_Vector:Vec3f = light.pos.sub(xFinal.pos);
                var L_length:number = L_Vector.length();

                if (light.getLightType() == light_types.DIRECTIONAL) {

                    ray_shadow = new Ray(xFinal.getPos(), light.getDir().negate());
                    L_length = Number.MAX_VALUE;
                }
                else if (light.getLightType() == light_types.POINT) {

                    ray_shadow = new Ray(xFinal.getPos(), L_Vector);
                }

                if (ray_shadow != null) {
                    cFinal.set(cFinal.scale(Math.min(RayWorker.traceShadow(ray_shadow, scene, xObject, L_length) + xObject.material.reflectivity, 1.0)));
                }
            }

        });

        if (xObject.material.reflectivity > 0.0)
        {
            var ray_reflected:Ray = new Ray(xFinal.getPos(), ray.getDir().reflect(xFinal.getNorm()));
            cFinal.set(cFinal.add(RayWorker.traceColor(ray_reflected, scene, n + 1).scale(xObject.material.reflectivity)));
        }

        if (xObject.material.refractivity > 0.0)
        {
            var ray_refracted:Ray;
            var N:Vec3f = xFinal.getNorm();
            var NdotI:number = ray.getDir().dot(N), ior, n1, n2, cos_t;

            if (NdotI > 0.0)
            {
                n1 = ray.getIOR();
                n2 = xObject.material.ior;
                N = N.negate();
            } else
            {
                n1 = xObject.material.ior;
                n2 = ray.getIOR();
                NdotI = -NdotI;
            }

            ior = n2 / n1;
            cos_t = ior * ior * (1.0 - NdotI * NdotI);

            ray_refracted = new Ray(xFinal.getPos(), ray.getDir().refract(N, ior, NdotI, cos_t), 1.0);
            cFinal.set(cFinal.add(RayWorker.traceColor(ray_refracted, scene, n + 1).scale(xObject.material.refractivity)));
        }

        cFinal.set(cFinal.add(xObject.material.color_ambient));

        return <Vec3f>MathUtils.clamp(cFinal, 0.0, 1.0);
    }

    static traceShadow(ray:Ray, s:Scene, thisobj:TracerObject, L_length:number)
    {
        var xInit:Intersection = null;
        var xFinal:Intersection = null;
        var xObject:TracerObject = null;
        var tInit:number = Number.MAX_VALUE;
        var weight:number = 1.0;

        s.objects.forEach(function(obj:TracerObject){
            if (obj === thisobj)
            {
                return;
            }

            obj.primitives.forEach(function(primitive:Primitive) {
                xInit = primitive.intersect(ray);
                if (xInit != null && xInit.getT() < tInit && xInit.getT() < L_length)
                {
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
    }

    getWidth():number
    {
        return this.width;
    }

    getHeight():number
    {
        return this.height;
    }

    getXOffset():number
    {
        return this.xoffset;
    }

    getYOffset():number
    {
        return this.yoffset;
    }

    getId():number
    {
        return this.id;
    }

    isFinished():boolean
    {
        return this.finished;
    }
}
new RayWorker();