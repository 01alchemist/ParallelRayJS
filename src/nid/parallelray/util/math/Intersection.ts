import {Vec3f} from "./Vec3f";

export class Intersection
{

	private m_pos:Vec3f;
	private m_norm:Vec3f;
	private m_t:number;

	constructor(pos:Vec3f = new Vec3f(), norm:Vec3f = new Vec3f(), t:number=0.0)
	{
		this.m_pos = pos;
		this.m_norm = norm;
		this.m_t = t;
	}

	getPos():Vec3f
	{
		return this.m_pos;
	}

	getNorm():Vec3f
	{
		return this.m_norm;
	}

	getT():number
	{
		return this.m_t;
	}

	setPos(pos:Vec3f):void
	{
		this.m_pos.set(pos);
	}

	setNorm(norm:Vec3f):void
	{
		this.m_norm.set(norm);
	}

	setT(t:number):void
	{
		this.m_t = t;
	}

}
