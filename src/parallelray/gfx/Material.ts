import {material_types} from "../util/Config";
import {Vec3f} from "../util/math/Vec3f";
import {Config} from "../util/Config";

export abstract class Material
{

	// Material type
	public material_type:material_types;

	// General shading variables
	public color_ambient:Vec3f;
	public color_diffuse:Vec3f;
	public color_specular:Vec3f;
	public reflectivity:number;
	public refractivity:number;
	public ior:number;

	// Phong shading model variables
	public shininess:number;

	// Cook-torrance shading model variables
	public roughness:number;
	public fresnel:number;
	public density:number;

	constructor(){

    }

	public getMaterialType():material_types
	{
		return this.material_type;
	}

	getColorAmbient():Vec3f
	{
		return this.color_ambient;
	}

	getColorDiffuse():Vec3f
	{
		return this.color_diffuse;
	}

	getColorSpecular():Vec3f
	{
		return this.color_specular;
	}

	getShininess():number
	{
		return this.shininess;
	}

	getRoughness():number
	{
		return this.roughness;
	}

	getFresnel():number
	{
		return this.fresnel;
	}

	getDensity():number
	{
		return this.density;
	}

	getReflectivity():number
	{
		return this.reflectivity;
	}

	getRefractivity():number
	{
		return this.refractivity;
	}

	getIOR():number
	{
		return this.ior;
	}

}
