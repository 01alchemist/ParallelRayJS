import {Display} from "./Display";
import {Tracer} from "./Tracer";
import {Ray} from "../util/math/Ray";
import {TracerObject} from "./TracerObject";
import {Intersection} from "../util/math/Intersection";
import {Shader} from "../shader/Shader";
import {Config} from "../util/Config";
import {Primitive} from "../util/math/Primitive";
import {Light} from "./Light";
import {Vec3f} from "../util/math/Vec3f";
export class RayWorker
{

	private m_width:number;
	private m_height:number;
	private m_xoffset:number;
	private m_yoffset:number;
	private m_id:number;
	private m_finished:boolean;

	private m_tracer:Tracer;
	private m_display:Display;

	constructor(width:number, height:number, xoffset:number, yoffset:number, id:number, tracer:Tracer)
	{
		this.m_width = width;
		this.m_height = height;
		this.m_xoffset = xoffset;
		this.m_yoffset = yoffset;
		this.m_id = id;
		this.m_finished = true;
		this.m_tracer = tracer;
	}

	run():void
	{
		this.m_finished = false;
		if (this.m_tracer != null && this.m_display != null)
		{
			var width:number = Config.g_window_width;
			var height:number = Config.g_window_height;
			var ray_primary:Ray = new Ray();
			for (var y:number = this.m_yoffset; y < this.m_yoffset + this.m_height; y++)
			{
				for (var x:number = this.m_xoffset; x < this.m_xoffset + this.m_width; x++)
				{
					ray_primary = Ray.calcCameraRay(this.m_tracer.getCamera(), width, height, this.m_display.getAR(), x, y);
					this.m_display.drawPixelVec3f(x, y, traceColor(ray_primary, this.m_tracer.getScene(), 0));
					if (Config.g_debug && x == this.m_xoffset + 1 || Config.g_debug && y == this.m_yoffset)
						this.m_display.drawPixelInt(x, y, 0xFFFF00FF);
				}
			}
		}
		this.m_finished = true;
	}

	static traceColor(r:Ray, s:Scene, n:number):Vec3f
	{
		// Break out from the method if max recursion depth is hit
		if (n > Config.g_recursion_max)
			return Shader.COLOR_NULL;

		// Initialize the required intersection data
		var xInit:Intersection = null;
		var xFinal:Intersection = null;
		var  xObject:TracerObject = null;
		var tInit:number = Float.MAX_VALUE;

		// Find the nearest intersection point
		for (var o:TracerObject  in s.getObjects())
		{
			for (var p:Primitive in o.getPrimitives())
			{
				xInit = p.intersect(r);
				if (xInit != null && xInit.getT() < tInit)
				{
					xFinal = xInit;
					tInit = xFinal.getT();
					xObject = o;
				}
			}
		}

		// Return a blank color if the ray didn't hit anything
		if (xFinal == null)
			return Shader.COLOR_NULL;

		// Initialize the main color which will be calculated and returned
		var cFinal:Vec3f = new Vec3f();

		// Shade the surface point against all lights in the scene
		for (var l:Light in s.getLights())
		{
			cFinal.set(cFinal.add(Shader.main(r, xFinal, l, xObject.getMaterial())));

			var ray_shadow:Ray = null;

			if (xObject.getMaterial().getReflectivity() != 1.0f)
			{
				var L_Vector:Vec3f = l.getPos().sub(xFinal.getPos());
				var L_length:number = L_Vector.length();
				if (l.getLightType() == Config.g_light_types.DIRECTIONAL)
				{
					ray_shadow = new Ray(xFinal.getPos(), l.getDir().negate());
					L_length = Float.MAX_VALUE;
				} else if (l.getLightType() == Config.g_light_types.POINT)
				{
					ray_shadow = new Ray(xFinal.getPos(), L_Vector);
				}

				if (ray_shadow != null)
					cFinal.set(cFinal.scale(Math.min(traceShadow(ray_shadow, s, xObject, L_length) + xObject.getMaterial().getReflectivity(), 1.0f)));
			}

		}

		if (xObject.getMaterial().getReflectivity() > 0.0)
		{
			var ray_reflected:Ray = new Ray(xFinal.getPos(), r.getDir().reflect(xFinal.getNorm()));
			cFinal.set(cFinal.add(traceColor(ray_reflected, s, n + 1).scale(xObject.getMaterial().getReflectivity())));
		}

		if (xObject.getMaterial().getRefractivity() > 0.0f)
		{
			Ray ray_refracted;
			Vec3f N = xFinal.getNorm();
			float NdotI = r.getDir().dot(N), ior, n1, n2, cos_t;

			if (NdotI > 0.0f)
			{
				n1 = r.getIOR();
				n2 = xObject.getMaterial().getIOR();
				N = N.negate();
			} else
			{
				n1 = xObject.getMaterial().getIOR();
				n2 = r.getIOR();
				NdotI = -NdotI;
			}

			ior = n2 / n1;
			cos_t = ior * ior * (1.0f - NdotI * NdotI);

			ray_refracted = new Ray(xFinal.getPos(), r.getDir().refract(N, ior, NdotI, cos_t), 1.0f);
			cFinal.set(cFinal.add(traceColor(ray_refracted, s, n + 1).scale(xObject.getMaterial().getRefractivity())));
		}

		cFinal.set(cFinal.add(xObject.getMaterial().getColorAmbient()));

		return MathUtils.clamp(cFinal, 0.0f, 1.0f);
	}

	public static float traceShadow(Ray r, Scene s, TracerObject thisobj, float L_length)
	{
		Intersection xInit = null;
		Intersection xFinal = null;
		TracerObject xObject = null;
		float tInit = Float.MAX_VALUE;
		float weight = 1.0f;

		for (TracerObject o : s.getObjects())
		{
			if (o.equals(thisobj))
			{
				continue;
			}

			for (Primitive p : o.getPrimitives())
			{
				xInit = p.intersect(r);
				if (xInit != null && xInit.getT() < tInit && xInit.getT() < L_length)
				{
					xFinal = xInit;
					tInit = xFinal.getT();
					xObject = o;
				}
			}
		}

		if (xFinal == null)
			return 1.0f;

		if (xObject.getMaterial().getReflectivity() > 0.0f)
			weight -= xObject.getMaterial().getReflectivity();

		if (xObject.getMaterial().getRefractivity() > 0.0f)
			weight *= xObject.getMaterial().getRefractivity();

		return weight;
	}

	public int getWidth()
	{
		return m_width;
	}

	public int getHeight()
	{
		return m_height;
	}

	public int getXOffset()
	{
		return m_xoffset;
	}

	public int getYOffset()
	{
		return m_yoffset;
	}

	public int getId()
	{
		return m_id;
	}

	public boolean isFinished()
	{
		return m_finished;
	}

	public void setDisplay(Display display)
	{
		m_display = display;
	}

}
