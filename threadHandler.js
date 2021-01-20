const { Worker } = require('worker_threads');

const maxPerThread = 32;
var startSuccess = false;

class threadHandler{
    
    constructor(){
    this.workerList = [];

    this.newThread();

    
    }
    newThread = () => {
        this.workerList.push({ users:[], child:new Worker('./bot instance/mclientHandler.js')});
        this.workerList[this.workerList.length-1].child.on('message',this.onMessage);
        this.workerList[this.workerList.length-1].child.on('error',this.onError); 
    }

    newMClient = async (userObj) => {
        let responses = [];

        await this.workerList.forEach((child,index) => {
             child.child.postMessage({
                intent:'check'
            });
            child.child.once('message',(msg) =>{
                if(msg.intent == 'response'){
                responses[index] = msg.data.response;
            }});

        });
        setTimeout(() => {
            startSuccess = false;
        responses.forEach((response,index)=>{
            if(response < maxPerThread){
                this.workerList[index].child.postMessage({
                    intent:'start',
                    data:userObj
                });
                this.workerList[index].users.push(userObj);

                startSuccess=true;
                return;
            }
        });
        if(startSuccess) return;
        this.newThread();
        this.newMClient(userObj);
    },1000);
    }
    onMessage = (msg) =>{
        try{
       msg.channel = database.users[dbgetObjIndex({id:msg.id})].channel;
        toDiscord(msg.channel,msg.data.response);
        }catch(e){}
        console.log(msg);
    }
    onError = (msg) =>{
     //   this.workerList.users.forEach(user => {
    //        toDiscord(user.channel, 'Your bot crashed. Try running _start again.');
      //  });
        console.log(msg);
    }
    stop = (userObj) =>{
        this.workerList.forEach((child)=>{child.users.splice(child.users.indexOf(userObj.id),1)});
        let resp = {
            intent:'stop',
            data:userObj
        }
        this.workerList.forEach((child) =>{
            child.child.postMessage(resp);
            console.log(resp);
        });
    }

    }

    module.exports = threadHandler;