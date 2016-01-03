import {g_material_types} from "../util/Config";
import {Vec3f} from "../util/math/Vec3f";
import {Config} from "../util/Config";

export abstract class Material
{

	// Material type
	protected m_material_type:g_material_types;

	// General shading variables
	protected m_color_ambient:Vec3f;
	protected m_color_diffuse:Vec3f;
	protected m_color_specular:Vec3f;
	protected m_reflectivity:number;
	protected m_refractivity:number;
	protected m_ior:number;

	// Phong shading model variables
	protected m_shininess:number;

	// Cook-torrance shading model variables
	protected m_roughness:number;
	protected m_fresnel:number;
	protected m_density:number;

	constructor(){

    }

	public getMaterialType():g_material_types
	{
		return this.m_material_type;
	}

	getColorAmbient():Vec3f
	{
		return this.m_color_ambient;
	}

	getColorDiffuse():Vec3f
	{
		return this.m_color_diffuse;
	}

	getColorSpecular():Vec3f
	{
		return this.m_color_specular;
	}

	getShininess():number
	{
		return this.m_shininess;
	}

	getRoughness():number
	{
		return this.m_roughness;
	}

	getFresnel():number
	{
		return this.m_fresnel;
	}

	getDensity():number
	{
		return this.m_density;
	}

	getReflectivity():number
	{
		return this.m_reflectivity;
	}

	getRefractivity():number
	{
		return this.m_refractivity;
	}

	getIOR():number
	{
		return this.m_ior;
	}

}
