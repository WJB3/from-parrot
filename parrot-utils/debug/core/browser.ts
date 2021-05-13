//@ts-ignore 
import supportsColor from '@parrotjs/supports-color';
import setup from './common'; 
 
function formatArgs(args){
    args[0]=`
        ${supportsColor?'%c':''}
        ${this.namespace}
        ${supportsColor?' %c':' '}
        ${args[0]}
        ${supportsColor?'%c ':' '}
        +${this.diffTime(this.diff)}
    ` 
    if(!supportsColor){
        return ;
    } 
    const c=`color: ${this.color}`;
    args.splice(1,0,c,'color:inherit');
}

export default setup({
    formatArgs
});