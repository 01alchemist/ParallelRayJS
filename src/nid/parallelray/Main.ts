import {Display, Tracer} from "./gfx/gfx";
import {Config} from "./util/util";
import {Engine} from "./Engine";

export class Main
{

	static g_display:Display;
	static g_tracer:Tracer;
	static g_engine:Engine;

	constructor() {

	}
	ngOnInit(){
		Config.init();
        Main.g_display = new Display(Config.g_window_width, Config.g_window_height, Config.g_display_scale, "Parallel Raytracer");
        Main.g_display.create();
        Main.g_tracer = new Tracer();
        Main.g_engine = new Engine(Main.g_display, Main.g_tracer);
        Main.g_engine.start();
	}

}
