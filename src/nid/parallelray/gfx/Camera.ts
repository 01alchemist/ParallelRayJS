import {InputListener} from "../InputListener"
import {Vec3f} from "../util/math/Vec3f";
import {Quaternion} from "../util/math/Quaternion";

export class Camera
{

	private m_pos:Vec3f;
	private m_rot:Quaternion;
	private m_speed:number;
	private m_sensitivity:number;

	constructor(pos:Vec3f, speed:number, sensitivity:number)
	{
		this.m_pos = pos;
        this.m_rot = new Quaternion(0, 0, 1, 0);
        this.m_speed = speed;
        this.m_sensitivity = sensitivity;
	}

	update(dt:number):void
	{
		// Camera movement
		if (InputListener.getKeyboardKeys()[InputListener.KEY_W])
		{
            this.move(this.getForward(), this.m_speed * dt);
		} else if (InputListener.getKeyboardKeys()[InputListener.KEY_S])
		{
            this.move(this.getForward().negate(), this.m_speed * dt);
		}
		if (InputListener.getKeyboardKeys()[InputListener.KEY_A])
		{
            this.move(this.getRight().negate(), this.m_speed * dt);
		} else if (InputListener.getKeyboardKeys()[InputListener.KEY_D])
		{
            this.move(this.getRight(), this.m_speed * dt);
		}
		if (InputListener.getKeyboardKeys()[InputListener.KEY_R])
		{
            this.move(this.getUp(), this.m_speed * dt);
		} else if (InputListener.getKeyboardKeys()[InputListener.KEY_F])
		{
            this.move(this.getUp().negate(), this.m_speed * dt);
		}

		// Camera rotation
		if (InputListener.getKeyboardKeys()[InputListener.KEY_RIGHT])
            this.rotate(this.getUp(), this.m_sensitivity * dt);
		if (InputListener.getKeyboardKeys()[InputListener.KEY_LEFT])
            this.rotate(this.getUp(), -this.m_sensitivity * dt);
		if (InputListener.getKeyboardKeys()[InputListener.KEY_UP])
            this.rotate(this.getRight(), -this.m_sensitivity * dt);
		if (InputListener.getKeyboardKeys()[InputListener.KEY_DOWN])
            this.rotate(this.getRight(), this.m_sensitivity * dt);
		if (InputListener.getKeyboardKeys()[InputListener.KEY_E])
            this.rotate(this.getForward(), this.m_sensitivity * dt);
		if (InputListener.getKeyboardKeys()[InputListener.KEY_Q])
            this.rotate(this.getForward(), -this.m_sensitivity * dt);
	}

	move(direction:Vec3f, amount:number):void
	{
        this.m_pos.set(this.m_pos.add(direction.scale(amount)));
	}

	rotate(axis:Vec3f, theta:number):void
	{
		var rotation:Quaternion = new Quaternion().createFromAxisAngle(axis.x, axis.y, axis.z, theta);
        this.m_rot = rotation.mul(this.m_rot).normalize();
	}

	getPos():Vec3f
	{
		return this.m_pos;
	}

	getRot():Quaternion
	{
		return this.m_rot;
	}

	getForward():Vec3f
	{
		return this.m_rot.getForwardVector();
	}

	getRight():Vec3f
	{
		return this.m_rot.getRightVector();
	}

	getUp():Vec3f
	{
		return this.m_rot.getUpVector();
	}

}
