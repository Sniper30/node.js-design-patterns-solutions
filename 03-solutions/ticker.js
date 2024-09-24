import { log } from 'console';
import {EventEmitter} from 'events'
let event = new EventEmitter();
let count = 0;
function Ticker(max,cb){
    let date = Date.now();
    try {
        
        if(date % 5 === 0) throw Error('si es divisible por 5')
    } catch (error) {
        
            process.nextTick(()=>{
            cb(error)
            event.emit('error',"el rrorrr "+date)
        })
    }
    process.nextTick(()=>event.emit('tick','tick'));
    if(max === 0) return cb(count);
    count++;
    recursive()
    function recursive(){
        setTimeout(() => {
            console.log(max)
            Ticker(max-50,cb)
        }, 50);
    }
    return event
}

Ticker(1000,(err,value)=>{
    if(err) return console.log('hubo un error' + err)
    console.log(value)
})
.on('tick',tick => log(tick))