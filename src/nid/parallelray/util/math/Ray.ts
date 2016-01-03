import {Vec3f} from "./Vec3f";
import {Camera} from "../../gfx/Camera";

export class Ray
{

	m_pos:Vec3f;
	m_dir:Vec3f;
	m_ior:number;

    constructor(pos:Vec3f=new Vec3f(), dir?:Vec3f, ior:number=1.0)
	{
		this.m_pos = pos;
        this.m_dir = dir?dir.normalize():new Vec3f();
        this.m_ior = ior;
	}

	static calcCameraRay(c:Camera, w:number, h:number, ar:number, x:number, y:number):Ray
	{
		let x_norm:number = (x - w * 0.5) / w * ar;
        let y_norm:number = (h * 0.5 - y) / h;
		
		let forward:Vec3f = c.getForward();
		let up:Vec3f = c.getUp();
		let right:Vec3f = c.getRight();

		let image_point:Vec3f = right.scale(x_norm).add(up.scale(y_norm)).add(c.getPos().add(forward));
		let ray_direction:Vec3f = image_point.sub(c.getPos());

		return new Ray(c.getPos(), ray_direction);
	}

	getPos():Vec3f
	{
		return this.m_pos;
	}

	getDir():Vec3f
	{
		return this.m_dir;
	}
	
	getIOR():number
	{
		return this.m_ior;
	}

	setPos(pos:Vec3f):void
	{
		this.m_pos.set(pos);
	}

	setDir(dir:Vec3f):void
	{
		this.m_dir.set(dir);
	}
	
	setIOR(ior:number):void
	{
		this.m_ior = ior;
	}

}
