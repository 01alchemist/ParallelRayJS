import {g_light_types} from "../util/Config";
import {Vec3f} from "../util/math/Vec3f";

export class Light
{

	// Light type
	protected m_light_type:g_light_types;

	// General light variables
	protected m_color:Vec3f;
	protected m_intensity:number;

	// Directional light variables
	protected m_dir:Vec3f;

	// Point light variables
	protected m_pos:Vec3f;
	protected m_constant:number;
	protected m_linear:number;
	protected m_exponent:number;

	constructor(){
    }

	getLightType():g_light_types
	{
		return this.m_light_type;
	}

	getPos():Vec3f
	{
		return this.m_pos;
	}

	getDir():Vec3f
	{
		return this.m_dir;
	}

	getColor():Vec3f
	{
		return this.m_color;
	}

	getIntensity():number
	{
		return this.m_intensity;
	}

	getConstant():number
	{
		return this.m_constant;
	}

	getLinear():number
	{
		return this.m_linear;
	}

	getExponent():number
	{
		return this.m_exponent;
	}

}
