import {Vec3f} from "../util/math/Vec3f";
import {MathUtils} from "../util/math/MathUtils";
import {Config} from "../util/Config";
export class Display {

    static serialVersionUID:number = 1;

    private title:string;
    private width:number;
    private height:number;
    private scale:number;
    private pixels:ImageData;
    private image;//:BufferedImage;
    private dimension;//:Dimension;
    private info;
    private canvas;
    private ctx;
    private bufferstrategy;//:BufferStrategy;

    constructor(width:number, height:number, scale:number, title:string) {
        this.title = title;
        this.width = width;
        this.height = height;
        this.scale = scale;
    }

    public create():void {

        this.info = document.getElementById("info");
        this.canvas = document.getElementById("viewport");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");

        if (this.image == null) {
            this.image = new ImageData(this.width, this.height);
            this.pixels = this.image.data;
            this.clear();
        }

        this.ctx.putImageData(this.image, 0, 0);
    }

    public render(_pixels):void {

        //var proxy = this.image.data;

        for (var y = 0; y < this.image.height; y++) {
            for (var x = 0; x < this.image.width; x++) {
                var index = ((y * (this.image.width * 4)) + (x * 4));
                this.pixels[index] = _pixels[index];
                this.pixels[index + 1] = _pixels[index + 1];
                this.pixels[index + 2] = _pixels[index + 2];
                this.pixels[index + 3] = 255;
            }
        }

        this.ctx.putImageData(this.image, 0, 0);
        /*this.ctx.fillStyle = 'rgba(255,0,0,255)';
         this.ctx.fillRect(Math.random() * 100,Math.random() * 100,50,50);*/
    }

    clear() {
        //Array.fill(this.pixels, 0x000000);
    }

    drawPixelVec3f(x:number, y:number, v:Vec3f) {
        if (x < 0 || x > this.width || y < 0 || y > this.height)
            return;

        v = <Vec3f>MathUtils.smoothstep(MathUtils.clamp(v, 0.0, 1.0), 0.0, 1.0);

        //var index:number = x + y * this.width;
        var index:number = ((y * (this.width * 4)) + (x * 4));
        var red:number = (v.x * 255.0);
        var green:number = (v.y * 255.0);
        var blue:number = (v.z * 255.0);
        //var hex_value:number = ((red << 16) | (green << 8) | blue);

        this.pixels[index] = red;
        this.pixels[index + 1] = green;
        this.pixels[index + 2] = blue;
        this.pixels[index + 3] = 255;
    }

    drawPixelInt(x:number, y:number, color:number) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
            return;

        //this.pixels[x + y * this.width] = color;
        var index:number = ((y * (this.width * 4)) + (x * 4));

        var red = (color >> 16) & 255;
        var green = (color >> 8) & 255;
        var blue = color & 255;

        this.pixels[index] = red;
        this.pixels[index + 1] = green;
        this.pixels[index + 2] = blue;
        this.pixels[index + 3] = 255;
    }

    saveBitmapToFile(fileName:string) {
        /*var filePath:string = "./renders/" + fileName + ".png";
         var output;
         try
         {
         output = new FileOutputStream(filePath);
         BufferedImage bi = getImage();
         ImageIO.write(bi, "png", output);
         } catch (IOException e)
         {
         e.printStackTrace();
         System.exit(1);
         }*/
    }

    getWidth():number {
        return this.width;
    }

    getHeight():number {
        return this.height;
    }

    getPixels():ImageData {
        return this.pixels;
    }

    getImage() {
        return this.image;
    }

    getDimension() {
        return this.dimension;
    }

    /*getJFrame()
     {
     return this.jframe;
     }*/

    get2dContex() {
        return this.ctx;
    }

    getAR():number {
        return this.width / this.height;
    }

    getScale():number {
        return this.scale;
    }

    setTitle(title:string) {
        //this.jframe.setTitle(this.title + " | " + this.title);
        this.info.innerHTML = this.title + " | " + title;
    }

    setWidth(width) {
        this.width = width;
    }

    setHeight(height) {
        this.height = height;
    }

    setPixels(pixels:ImageData) {
        this.pixels = pixels;
    }

    setImage(image) {
        this.image = image;
    }

    setDimension(dimension) {
        this.dimension = dimension;
    }

    /*setJFrame(jframe)
     {
     this.jframe = jframe;
     }*/

    setScale(scale:number) {
        this.scale = scale;
    }

}