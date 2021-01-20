
const Discord = require('discord.js');
const database = require('./database');
const token = 'Nzk5ODQxMDU3NTQxODQ5MTcw.YAJcCA.p5IrMf3aOc8hjHFIx8b-jOx97fc';
//const { fork } = require('child_process');

const threadHandlerclass = require('./threadHandler.js');
var threadHandler = new threadHandlerclass;



class bot {
    
    
    constructor(){
        this.client = new Discord.Client()
        this.client.login(token);
        this.client.on('ready',()=>{
            console.log('ready');
        });
    }
    onMessage = (funct)=>{
        this.client.on('message',msg=>{
            funct(msg);
        });
    }
    sendMessageTo = (id,content) =>{
        let client = this.client;
       try{
           let channel =
            client.users.cache.get(id);
            channel.send(content);
       }catch(e){console.log(e);} 
        try{
            let channel = 
            client.channels.cache.get(id);
            channel.send(content);

        
        }catch(e){console.log(e);}
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
    threadHandler.newMClient(userObj);
}
static stop = (userObj) => {
    threadHandler.stop(userObj);
    
}


}
module.exports.Discord = Discord;
module.exports.bot = bot;
module.exports.User = User;
module.exports.mclient = mclient;
