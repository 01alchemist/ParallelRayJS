import {Primitive} from "./Primitive";
import {Vec3f} from "./Vec3f";
import {Ray} from "./Ray";
import {Intersection} from "./Intersection";
import {Config} from "../Config";

export class Plane extends Primitive
{

	private m_normal:Vec3f;

    constructor(pos:Vec3f, normal:Vec3f)
	{
		super(pos);
		this.m_normal = normal;
	}

	intersect(r:Ray):Intersection
	{
		var P:Vec3f;
		var d:number;
        var t:number;

		P = this.m_vertices[0].sub(r.getPos());
		d = this.m_normal.dot(r.getDir());

		if (d > 0.0)
			return null;

		t = P.dot(this.m_normal) / d;

		if (t < Config.g_epsilon)
			return null;

		var x:Intersection = new Intersection();
		x.setPos(r.getPos().add(r.getDir().scale(t)));
		x.setNorm(this.m_normal.normalize());
		x.setT(t);

		return x;
	}

}
