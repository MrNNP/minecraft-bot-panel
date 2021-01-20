const { Client} = require('./new.js');
var bot = new Client((loga)=>{
    console.log(loga)
},48409238409238,'localhost',25565,'imaBot',undefined,'MrNNP');


setTimeout(()=>{
    bot.bot.quit();
    console.log('done');
},10000);