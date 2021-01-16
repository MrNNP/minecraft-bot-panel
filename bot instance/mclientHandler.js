const readline = require('readline');
const { Client } = require('./new.js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

var mclient;
rl.on('line', (input)=>{

    let input = JSON.parse(input);
    switch (input.intent){
        case 'start':
            mclient = new Client(input.data.ip,null,input.data.username,input.data.password,input.data.owner);
        break;
        case 'stop':
            mclient.bot.end();
            process.exit(0);
        break;
    }

});

rl.on('close', ()=>{

    mclient.bot.end();
    process.exit(0);

});
