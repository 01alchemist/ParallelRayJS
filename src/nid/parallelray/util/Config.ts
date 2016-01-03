import {Logger} from "./Logger";

export enum g_material_types{
    PHONG, COOKTORRANCE
}

export enum g_light_types
{
    DIRECTIONAL, POINT
}

export class Config
{

	static LOG:Logger      = new Logger('ParallelRay');

	static RES_ROOT:string = "./res/";

	static g_window_width:number = 256;
	static g_window_height:number = 256;
	static g_display_scale:number = 2;
	static g_recursion_max:number = 3;
	static g_thread_amount:number = -1;
    static g_epsilon:number = 1e-3;
	static g_debug:boolean = true;

    constructor(){

    }

	static init():void
	{
		/*File f = new File(Config.RES_ROOT + "config.cfg");
		if (f.exists() && !f.isDirectory())
		{
			load();
		} else
		{
			create();
			init();
		}*/
        Config.create();
	}

	static create():void
	{
		var p:Map<string,any> = new Map<string,any>();
		var o = null;
		try
		{
			//o = new FileOutputStream(Config.RES_ROOT + "config.json");

			// Set each variable
			p.set("g_window_width", Config.g_window_width);
			p.set("g_window_height", Config.g_window_height);
			p.set("g_display_scale", Config.g_display_scale);
			p.set("g_recursion_max", Config.g_recursion_max);
			p.set("g_thread_amount", Config.g_thread_amount);
			p.set("g_epsilon", Config.g_epsilon);
			p.set("g_debug", Config.g_debug);

			// Store the variables
			//p.store(o, null);

			// Close the outputstream object
			//o.close();

			Config.LOG.printMsg(Config.RES_ROOT + "config.cfg" + " Created succesfully!");
		} catch (e)
		{
            Config.LOG.printErr("Couldn't create the main configuration file, closing program...");
		}
	}

	static load():void
	{
        var p:Map<string,any> = new Map<string,any>();
		var i = null;
		try
		{
			//i = new FileInputStream(Config.RES_ROOT + "config.cfg");

			// Load the file
			//p.load(i);

			// Get the properties and set the config variables
            Config.g_window_width = p.get("g_window_width");
            Config.g_window_height = p.get("g_window_height");
            Config.g_display_scale = p.get("g_display_scale");
            Config.g_recursion_max = p.get("g_recursion_max");
            Config.g_thread_amount = p.get("g_thread_amount");
            Config.g_epsilon = p.get("g_epsilon");
            Config.g_debug = p.get("g_debug");

			// Close the inputstream object
			//i.close();

            Config.LOG.printMsg(Config.RES_ROOT + "config.cfg" + " loaded succesfully!");
		} catch (e)
		{
            Config.LOG.printErr("Couldn't load the main configuration file, closing program...");
		}
	}

}
