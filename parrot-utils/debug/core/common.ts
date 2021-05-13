//@ts-ignore
import { isTypeString } from '@parrotjs/which-type';

function setup(env){

    Object.keys(env).forEach(key=>{
        createDebug[key]=env[key];
    });
    
    /**
     * 使用给定的“命名空间”创建一个调试器。
     * @param namespace 命名空间
     */
    function createDebug(namespace){
        let prevTime; 

        function debug(...args){
            const self=debug;

            const curr=Number(new Date());
            const ms=curr-(prevTime || curr);

            (self as any).diff=ms;
            (self as any).prev=prevTime||curr;
            (self as any).curr=curr;

            prevTime=curr;

            if (isTypeString(args[0])) {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

            (createDebug as any).formatArgs.call(self,args);

            const logFn=(createDebug as any).log || console.log;
            logFn.apply(self,args);
        }

        debug.namespace=namespace;
 
    } 

    return createDebug;
}

export default setup;