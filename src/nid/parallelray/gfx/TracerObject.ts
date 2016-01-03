import {Primitive} from "../util/math/Primitive";
import {Material} from "./Material";
import {Vec3f} from "../util/math/Vec3f";
import {Sphere} from "../util/math/Sphere";
import {Plane} from "../util/math/Plane";

export class TracerObject
{

	private m_primitives:Array<Primitive>;
	private m_material:Material;

    constructor(arg1:Vec3f|Array<Primitive>, arg2:number|Vec3f|Material, arg3?:Material)
	{
        if(arg1 instanceof Vec3f){
            let pos:Vec3f = <Vec3f>arg1;
            this.m_primitives = [];
            if(arg2 instanceof Vec3f){
                this.m_primitives.push(new Plane(pos, <Vec3f>arg2));
            }else{
                this.m_primitives.push(new Sphere(pos, <number>arg2));
            }
            this.m_material = <Material>arg3;
        }else{
            this.m_primitives = Array<Primitive>arg1;
            this.m_material = <Material>arg2;
        }

	}

	getPrimitives():Array<Primitive>
	{
		return this.m_primitives;
	}

	getMaterial():Material
	{
		return this.m_material;
	}

}
