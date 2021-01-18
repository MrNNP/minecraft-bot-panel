//const readline = require('readline');
const { Client } = require('./new.js');
const { parentPort, workerData } = require('worker_threads');

/*
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
*/
var mclientList = [];


parentPort.on('message', (input)=>{
    
    switch (input.intent){
        case 'start':
            mclientList.push({
                id:input.data.id, 
                channel:input.data.channel,
                client:new Client(
                sendOut,
                input.data.id,
                input.data.options.bot.ip,
                null,
                input.data.options.bot.username,
                input.data.options.bot.password,
                input.data.options.bot.owner)});
        break;
        case 'check':
            
            sendOut({
                intent:'response',  
                data:{
                    purpose:'check',
                    response:mclientList.length
                }
            });
            
        break;
        case 'kill':
            mclientList.forEach((client)=>{
            client.client.bot.end();
        });
        process.exit(0);
        break;
        case 'stop':
            try{
            checkID(input.data.id).quit();
            }catch(e){};
        }

});

function sendOut(data){
    parentPort.postMessage(data);
    
}

function checkID(id){
    mclientList.forEach(client,()=>{
        if(id==client.id){
            return client;
        }
    });
}