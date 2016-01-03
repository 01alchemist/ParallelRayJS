import {Display} from "./gfx/Display";
import {Tracer} from "./gfx/Tracer";
import {InputListener} from "./InputListener";
import {Logger} from "./util/Logger";
export class Engine
{

	private m_running:boolean;

	private m_display:Display;
	private m_tracer:Tracer;
	private m_ilistener:InputListener;
	private m_log:Logger;

    constructor(display:Display, tracer:Tracer)
	{
		this.m_display = display;
		this.m_ilistener = new InputListener();
		this.m_display.addKeyListener(this.m_ilistener);
		this.m_display.addMouseListener(this.m_ilistener);
		this.m_display.addMouseMotionListener(this.m_ilistener);

		this.m_tracer = tracer;

		this.m_log = new Logger(this.getClass().getName());

		this.m_running = false;
	}

	start():void
	{
		if (!this.m_running)
		{
			this.m_running = true;
			this.run();
		}
	}

	stop():void
	{
		if (this.m_running)
		{
			this.m_running = false;
		}
	}

	run():void
	{
		TimeUtils.init();
		TimeUtils.updateDelta();
		TimeUtils.updateFPS();
		while (this.m_running && this.m_display != null)
		{
			TimeUtils.updateDelta();
			TimeUtils.updateFPS();
			this.m_display.setTitle(String.format("Workers: %02d DeltaTime: %2.2f FPS: %2.2f/s Eye: %s Eye_length: %2.2f",
				this.m_tracer.getWorkers().size(), TimeUtils.getDelta(), TimeUtils.getFPS(),
                this.m_tracer.getCamera().getRot().toString(),
                this.m_tracer.getCamera().getRot().length()));
			update(TimeUtils.getDelta());
			this.render();
		}

		this.stop();
	}

	update(dt:number):void
	{
        this.m_tracer.update(dt);
	}

	render():void
	{
        this.m_tracer.render(this.m_display);
        this.m_display.render();
	}

}
