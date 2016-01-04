export class TimeUtils
{

	static second:number  = 1000000;
	static frame:number   = 1000;
	static timeres:number = 1;

	static currentTime:number;
	static lastTime:number;
	static time:number;
	static delta:number;
	static fps:number;

	static init():void
	{
		TimeUtils.lastTime = TimeUtils.getTime();
		TimeUtils.updateDelta();
	}

	static updateDelta():void
	{
		TimeUtils.currentTime = TimeUtils.getTime();
		TimeUtils.delta = TimeUtils.delta * 0.9 + (TimeUtils.currentTime - TimeUtils.lastTime) * 0.1;
		TimeUtils.lastTime = TimeUtils.currentTime;
	}

	static updateFPS():void
	{
		TimeUtils.time++;

		if (TimeUtils.time >= TimeUtils.timeres)
		{
			if (isFinite(TimeUtils.fps)){
				TimeUtils.fps = 0.0;
			}
            TimeUtils.fps = TimeUtils.fps * 0.9 + (TimeUtils.timeres / TimeUtils.delta) * 0.1;
            TimeUtils.time -= TimeUtils.timeres;
		}
	}

	static getTime():number
	{
		return performance.now() / TimeUtils.second;
	}

	static getDelta():number
	{
		return TimeUtils.delta;
	}

	static getFPS():number
	{
		return TimeUtils.frame * TimeUtils.fps;
	}

}
