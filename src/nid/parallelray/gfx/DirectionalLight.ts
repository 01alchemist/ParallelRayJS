import {Light} from "./Light";
import {Vec3f} from "../util/math/Vec3f";
import {g_light_types} from "../util/Config";

/**
 * Created by Nidin Vinayakan on 03-01-2016.
 */

export class DirectionalLight extends Light{

    constructor(dir:Vec3f, color:Vec3f, intensity:number)
    {
        super();
        this.m_light_type = g_light_types.DIRECTIONAL;
        this.m_dir = dir.normalize();
        this.m_color = color;
        this.m_intensity = intensity;
    }

}
