export class Logger
{
	
	private m_prefix:string;

	constructor(prefix:string)
	{
		this.m_prefix = prefix;
		this.printMsg("Logger has started!");
	}

	printMsg(msg:string):void
	{
		console.log("[" + this.m_prefix + "]: " + msg);
	}

	printErr(msg:string):void
	{
		console.error("[" + this.m_prefix + "]: ERROR: " + msg);
	}

}
