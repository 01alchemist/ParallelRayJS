
import {Vec3f} from "../util/math/Vec3f";
import {MathUtils} from "../util/math/MathUtils";
export class Display
{

	static serialVersionUID:number = 1;

	private m_title:string;
	private m_width:number;
	private m_height:number;
	private m_scale:number;
	private m_pixels:number[];
	private m_image;//:BufferedImage;
	private m_dimension;//:Dimension;
	private m_jframe;//:JFrame;
	private m_bufferstrategy;//:BufferStrategy;

	constructor(width:number, height:number, scale:number, title:string)
	{
		this.m_title = title;
		this.m_width = width;
		this.m_height = height;
		this.m_scale = scale;
	}

	public create():void
	{
		// Create the bitmap
		if (this.m_image == null)
		{
			//this.m_image = new BufferedImage(this.m_width, this.m_height, BufferedImage.TYPE_INT_RGB);
			//this.m_pixels = this.m_image.getRaster().getDataBuffer().getData();
			this.clear();
		}

		// Create the jframe
		if (this.m_jframe == null)
		{
            /*this.m_dimension = new Dimension(this.m_width * this.m_scale, this.m_height * this.m_scale);
			this.setPreferredSize(this.m_dimension);
			this.m_jframe = new JFrame();
			this.m_jframe.setResizable(false);
			this.m_jframe.setTitle(m_title);
			this.m_jframe.add(this);
			this.m_jframe.pack();
			this.m_jframe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
			this.m_jframe.setLocationRelativeTo(null);
			this.m_jframe.setVisible(true);*/
		}

		// Create a buffer strategy using triplebuffering
		if (this.m_bufferstrategy == null)
		{
			//this.createBufferStrategy(3);
			//this.m_bufferstrategy = this.getBufferStrategy();
		}
	}

	public render():void
	{
		if (this.m_bufferstrategy != null)
		{
			/*var g:Graphics = this.m_bufferstrategy.getDrawGraphics();
			g.drawImage(this.m_image, 0, 0, this.m_width * this.m_scale, this.m_height * this.m_scale, null);
			g.dispose();
			this.m_bufferstrategy.show();*/
		}
	}

	clear()
	{
		//Array.fill(this.m_pixels, 0x000000);
	}

	drawPixelVec3f(x:number, y:number, v:Vec3f)
	{
		if (x < 0 || x > this.m_width || y < 0 || y > this.m_height)
			return;

		v = <Vec3f>MathUtils.smoothstep(MathUtils.clamp(v, 0.0, 1.0), 0.0, 1.0);

		var index:number = x + y * this.m_width;

		var red:number = (v.x * 255.0);
		var green:number = (v.y * 255.0);
		var blue:number = (v.z * 255.0);
		var hex_value:number = ((red << 16) | (green << 8) | blue);

		this.m_pixels[index] = hex_value;
	}

	drawPixelInt(x:number, y:number, color:number)
	{
		if (x < 0 || x >= this.m_width || y < 0 || y >= this.m_height)
			return;

		this.m_pixels[x + y * this.m_width] = color;
	}

	saveBitmapToFile(fileName:string)
	{
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

	getWidth():number
	{
		return this.m_width;
	}

	getHeight():number
	{
		return this.m_height;
	}

	getPixels():number[]
	{
		return this.m_pixels;
	}

	getImage()
	{
		return this.m_image;
	}

	getDimension()
	{
		return this.m_dimension;
	}

	getJFrame()
	{
		return this.m_jframe;
	}

	getAR():number
	{
		return this.m_width / this.m_height;
	}

	getScale():number
	{
		return this.m_scale;
	}

	setTitle(title:string)
	{
		//this.m_jframe.setTitle(this.m_title + " | " + this.title);
	}

	setWidth(m_width)
	{
		this.m_width = m_width;
	}

	setHeight(m_height)
	{
		this.m_height = m_height;
	}

	setPixels(m_pixels:number[])
	{
		this.m_pixels = m_pixels;
	}

	setImage(m_image)
	{
		this.m_image = m_image;
	}

	setDimension(m_dimension)
	{
		this.m_dimension = m_dimension;
	}

	setJFrame(m_jframe)
	{
		this.m_jframe = m_jframe;
	}

	setScale(m_scale:number)
	{
		this.m_scale = m_scale;
	}

}