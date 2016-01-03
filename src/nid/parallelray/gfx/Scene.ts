import {TracerObject} from "./TracerObject";
import {Light} from "./Light";
import {PhongMaterial} from "./PhongMaterial";
import {Vec3f} from "../util/math/Vec3f";
import {CookTorranceMaterial} from "./CookTorranceMaterial";
import {Material} from "./Material";
import {DirectionalLight} from "./DirectionalLight";
import {PointLight} from "./PointLight";
export class Scene
{

	private m_objects:Array<TracerObject>;
	private m_lights:Array<Light>;

	public Scene()
	{
		this.m_objects = [];
		this.m_lights = [];

		var m_diffuse_white:Material= new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(1.0), new Vec3f(1.0), 0.375, 0.5, 0.9, 0.0, 0, 0);
		var m_diffuse_red:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(1.0, 0.0, 0.0), new Vec3f(1.0), 0.375, 0.5, 0.9, 0.0, 0, 0);
		var m_diffuse_green:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 1.0, 0.0), new Vec3f(1.0), 0.375, 0.5, 0.9, 0.0, 0, 0);
		var m_diffuse_blue:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 0.0, 1.0), new Vec3f(1.0), 0.375, 0.5, 0.9, 0.0, 0, 0);
		var m_reflective_red:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(1.0, 0.0, 0.0), new Vec3f(1.0), 0.10, 1.0, 0.5, 0.25, 0, 0);
		var m_reflective_green:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 1.0, 0.0), new Vec3f(1.0), 0.05, 1.0, 0.5, 0.50, 0, 0);
		var m_reflective_blue:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 0.0, 1.0), new Vec3f(1.0), 0.20, 1.0, 0.75, 0.375, 0, 0);
		var m_reflective_metal:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 0.0, 0.0), new Vec3f(1.0), 0.10, 1.0, 0.5, 1.0, 0, 0);
		var m_refractive_glass:Material = new CookTorranceMaterial(new Vec3f(0.01), new Vec3f(0.0, 0.0, 0.0), new Vec3f(1.0), 0.10, 1.0, 0.5, 0.0, 1.0, 1.52);
		
		this.m_objects.push(new TracerObject(new Vec3f(0.0, 0.0, 0.0), new Vec3f(0.0, 1.0, 0.0), m_diffuse_white));
		this.m_objects.push(new TracerObject(new Vec3f(0.0, 5.0, 0.0), new Vec3f(0.0, -1.0, 0.0), m_diffuse_white));
		this.m_objects.push(new TracerObject(new Vec3f(0.0, 0.0, -10.0), new Vec3f(0.0, 0.0, 1.0), m_diffuse_white));
		this.m_objects.push(new TracerObject(new Vec3f(4.0, 0.0, 0.0), new Vec3f(-1.0, 0.0, 0.0), m_diffuse_red));
		this.m_objects.push(new TracerObject(new Vec3f(-4.0, 0.0, 0.0), new Vec3f(1.0, 0.0, 0.0), m_diffuse_blue));
		this.m_objects.push(new TracerObject(new Vec3f(1.0, 0.75, -4.0), 0.75, m_reflective_metal));
		this.m_objects.push(new TracerObject(new Vec3f(-1.0, 0.75, -5.0), 0.75, m_refractive_glass));

		this.m_lights.push(new PointLight(new Vec3f(0.0, 4.0, -5.0), new Vec3f(1.0), 1.0, 0.0, 0.0, 0.1));
	}

	update(dt:number):void
	{

	}

	getObjects():Array<TracerObject>
	{
		return this.m_objects;
	}

	getLights():Array<Light>
	{
		return this.m_lights;
	}

}
