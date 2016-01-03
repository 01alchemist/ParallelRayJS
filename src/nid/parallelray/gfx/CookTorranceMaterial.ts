import {Material} from "./Material";
import {Vec3f} from "../util/math/Vec3f";
import {g_material_types} from "../util/Config";

/**
 * Created by Nidin Vinayakan on 03-01-2016.
 */

export class CookTorranceMaterial extends Material{

    constructor( color_ambient:Vec3f, color_diffuse:Vec3f, color_specular:Vec3f, roughness:number, fresnel:number, density:number, reflectivity:number, refractivity:number, ior:number)
    {
        super();
        this.m_material_type = g_material_types.COOKTORRANCE;
        this.m_color_ambient = color_ambient;
        this.m_color_diffuse = color_diffuse;
        this.m_color_specular = color_specular;
        this.m_roughness = roughness;
        this.m_fresnel = fresnel;
        this.m_density = density;
        this.m_reflectivity = reflectivity;
        this.m_refractivity = refractivity;
        this.m_ior = ior;
    }
}
