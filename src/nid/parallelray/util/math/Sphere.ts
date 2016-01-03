import {Vec3f} from "./Vec3f";
import {Ray} from "./Ray";
import {Intersection} from "./Intersection";
import {Config} from "../Config";
import {Primitive} from "./Primitive";

export class Sphere extends Primitive
{

	private m_radius:number;

    constructor(pos:Vec3f, radius:number)
	{
		super(pos);
		this.m_radius = radius;
	}

	intersect(r:Ray):Intersection
	{
		let SP:Vec3f;
		let t:number;
        let b:number;
        let d:number;

		SP = this.m_vertices[0].sub(r.getPos());
		b = SP.dot(r.getDir());
		d = b * b - SP.dot(SP) + this.m_radius * this.m_radius;

		if (d < 0.0)
			return null;

		d = Math.sqrt(d);
		t = (t = b - d) > Config.g_epsilon ? t : ((t = b + d) > Config.g_epsilon ? t : -1.0);

		if (t == -1.0)
			return null;

        let x:Intersection = new Intersection();
		x.setPos(r.getPos().add(r.getDir().scale(t)));
		x.setNorm(x.getPos().sub(this.m_vertices[0]).divide(this.m_radius));
		x.setT(t);

		return x;
	}

}
