
const Discord = require('discord.js');
const database = require('./database');
const token = 'Nzk5ODQxMDU3NTQxODQ5MTcw.YAJcCA.p5IrMf3aOc8hjHFIx8b-jOx97fc';
const { fork } = require('child_process');
const { Worker } = require('worker_threads');
const rl = require('readline');




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
constructor(userObj,channel){
    
}

kill = () =>{
    this.child.send({intent:'stop'});
}
}
module.exports.Discord = Discord;
module.exports.bot = bot;
module.exports.User = User;
module.exports.mclient = mclient;


class threadHandler{
    
    constructor(){
    this.workerList = [];

    this.newThread();
    }
    newThread = () => {
        this.workerList.push(new Worker('bot instance/mclientHandler.js'));
    }

    newMClient = (userObj) => {
        let responses = [];

        this.workerList.forEach( async (child,index) => {
            child.postMessage({
                intent:'check'
            });
            await child.once('message',(msg) =>{
                responses[index] = msg.data.response;
            });

        });
        responses.forEach((response,index)=>{
            if(response < 16){
                this.workerList[index].postMessage({
                    intent:'start',
                    data:userObj
                });
                break;
                return;
            }
        });
        this.newThread();
        this.newMClient(userObj);
    }

    }







/*
this.child = new Worker('./mclientHandler.js');
    
    
    
    this.child.postMessage({
        intent:'start',
        data:userObj
    });
    this.child.on('message',(msg)=>{
        if(msg.intent == 'data'){
            switch (msg.content){
                case 'death':
                    channel.send( new Discord.MessageEmbed().setColor('#0522e3')).setTitle('I died');
                //TODO: add the rest of the events in

            }
        }else if(msg.intent == 'discord'){
            channel.send(msg.content);
        }


    });

    */