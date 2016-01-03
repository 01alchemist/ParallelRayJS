import {Vec3f} from "./Vec3f";
import {Ray} from "./Ray";
import {Intersection} from "./Intersection";

export abstract class Primitive
{

	protected m_vertices:Vec3f[];

    constructor(arg:Vec3f|Vec3f[])
    {
        let pos:Vec3f = arg instanceof Vec3f?arg:null;

        if(pos){
            this.m_vertices = new Vec3f[1];
            this.m_vertices[0] = pos;
        }else{
            this.m_vertices = <Vec3f[]>arg;
        }

    }

	public abstract intersect(r:Ray):Intersection;

	getVertices():Vec3f[]
	{
		return this.m_vertices;
	}

}
