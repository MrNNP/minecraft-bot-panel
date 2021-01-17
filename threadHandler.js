class threadHandler{
    
    constructor(){
    this.workerList = [];

    this.newThread();

    
    }
    newThread = () => {
        this.workerList.push({ users:[], child:new Worker('bot instance/mclientHandler.js')});
        this.workerList[this.workerList.length+1].on('message',onMessage(msg));
    }

    newMClient = (userObj) => {
        let responses = [];

        this.workerList.forEach( async (child,index) => {
            child.child.postMessage({
                intent:'check'
            });
            await child.child.once('message',(msg) =>{
                responses[index] = msg.data.response;
            });

        });
        responses.forEach((response,index)=>{
            if(response < maxPerThread){
                this.workerList[index].child.postMessage({
                    intent:'start',
                    data:userObj
                });
                this.workerList[index].users.push(userObj);

                break;
                return;
            }
        });
        this.newThread();
        this.newMClient(userObj);
    }
    onMessage = (msg) =>{
       msg.channel = database.users[dbgetObjIndex({id:msg.id})].channel;
        toDiscord(msg.channel,msg.data.response);
    }
    onError = (msg) =>{
        toDiscord()

    }


    }

    module.exports.threadHandler = threadHandler;