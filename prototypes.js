
const Discord = require('discord.js');
const database = require('./database');
const token = 'Nzk5ODQxMDU3NTQxODQ5MTcw.YAJcCA.p5IrMf3aOc8hjHFIx8b-jOx97fc';
//const { fork } = require('child_process');
const { Worker } = require('worker_threads');
var threadHandler = new require('./threadHandler.js').threadHandler;
const rl = require('readline');
const maxPerThread = 16;



class bot {
    
    
    constructor(){
        this.client = new Discord.Client()
        this.client.login(token);
        this.client.on('ready',()=>{
            console.log('ready');
        });
    }
    onMessage(funct){
        this.client.on('message',msg=>{
            funct(msg);
        });
    }
    sendMessageTo(id,content){
       try{
            this.client.users.cache.get(id).send(content);
       }catch(e){} 
        try{
            this.client.channels.cache.get(id).send(content);

        
        }catch(e){}
    }
    
}
class User{
    
    constructor(userData){
        this.data = userData;
        database.parsed.users.push(userData);

    }
    delete(){
        dbDeleteObj(userData);
    }
}
class mclient{
constructor(userObj){
    threadHandler.newMclient(userObj);
}
static stop = (userObj) => {
    threadHandler.stop(userObj);
    
}


}
module.exports.Discord = Discord;
module.exports.bot = bot;
module.exports.User = User;
module.exports.mclient = mclient;