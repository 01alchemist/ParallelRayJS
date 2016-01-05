import {RayWorker} from "../worker/RayWorker";
/**
 * Created by r3f on 4/1/2016.
 */
export class Thread{

    instance:Worker;

    onTraceComplete:Function;
    onInitComplete:Function;

    initialized:boolean;
    traced:boolean;
    isTracing:boolean;
    command:string;

    constructor(name:string){
        this.instance = new Worker("WorkerBootstrap.js");

        var self = this;

        this.instance.onmessage = function(event){
            if(event.data == RayWorker.INITED){
                self.initialized = true;
                self.isTracing = false;
                if(self.onInitComplete){
                    self.onInitComplete();
                }
            }
            if(event.data == RayWorker.TRACED){
                self.command = RayWorker.TRACED;
            }else{
                if(self.command == RayWorker.TRACED){
                    self.command = null;
                    self.isTracing = false;
                    self.traced = true;
                    if(self.onTraceComplete){
                        self.onTraceComplete(event.data);
                    }
                }
            }

        }
    }
    trace():void {
        this.isTracing = true;
        this.instance.postMessage(RayWorker.TRACE);
    }
    sendCommand(message:string):void {
        this.instance.postMessage(message);
    }
    sendData(data:any, buffers?):void {
        this.instance.postMessage(data, buffers);
    }
}