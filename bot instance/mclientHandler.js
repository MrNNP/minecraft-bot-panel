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
            mclient.push({
                id:input.data.id, 
                client:new Client(
                sendOut,
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
        case 'stop':
            mclientList.forEach((client)=>{
            client.client.bot.end();
        });
        process.exit(0);
        break;
    }

});

function sendOut(data){
    parentPort.postMessage(data);
}

