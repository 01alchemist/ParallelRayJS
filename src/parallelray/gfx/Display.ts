import {Vec3f} from "../util/math/Vec3f";
import {MathUtils} from "../util/math/MathUtils";
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
        // Create the bitmap
        if (this.image == null) {
            //this.image = new BufferedImage(this.width, this.height, BufferedImage.TYPE_INT_RGB);
            //this.pixels = this.image.getRaster().getDataBuffer().getData();
            this.image = new ImageData(this.width, this.height);
            this.pixels = this.image.data;
            this.clear();
        }

        // Create the jframe
        //if (this.jframe == null)
        //{
        /*this.dimension = new Dimension(this.width * this.scale, this.height * this.scale);
         this.setPreferredSize(this.dimension);
         this.jframe = new JFrame();
         this.jframe.setResizable(false);
         this.jframe.setTitle(title);
         this.jframe.add(this);
         this.jframe.pack();
         this.jframe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
         this.jframe.setLocationRelativeTo(null);
         this.jframe.setVisible(true);*/
        //}

        this.info = document.getElementById("info");
        this.canvas = document.getElementById("viewport");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.putImageData(this.image,0,0);

        // Create a buffer strategy using triplebuffering
        if (this.bufferstrategy == null) {
            //this.createBufferStrategy(3);
            //this.bufferstrategy = this.getBufferStrategy();
        }
    }

    public render(_pixels):void {
        this.image = new ImageData(this.width, this.height);
        this.image.data.buffer = _pixels.buffer;
        this.ctx.putImageData(this.image,0,0);
        this.ctx.fillStyle = 'rgba(255,0.9411764705882353,0.0588235294117647,1)';
        this.ctx.fillRect(Math.random() * 100,Math.random() * 100,50,50);
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