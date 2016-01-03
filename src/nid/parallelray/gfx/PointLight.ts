import {Light} from "./Light";
import {Vec3f} from "../util/math/Vec3f";
import {g_light_types} from "../util/Config";

/**
 * Created by Nidin Vinayakan on 03-01-2016.
 */

export class PointLight extends Light{

    constructor(pos:Vec3f, color:Vec3f, intensity:number, constant:number, linear:number, exponent:number)
    {
        this.m_light_type = g_light_types.POINT;
        this.m_pos = pos;
        this.m_color = color;
        this.m_intensity = intensity;
        this.m_constant = constant;
        this.m_linear = linear;
        this.m_exponent = exponent;
    }

}
