const { Client} = require('./new.js');
var bot = new Client({output:(loga)=>{
    console.log(loga)
},quitSelf:(loga)=>{
    console.log(loga)

}},48409238409238,'localhost',25565,'imaBot',undefined,'MrNNP');


bot.bot.on('spawn',()=>{
    console.log('spawned');
});

//setTimeout(()=>{
//    bot.bot.quit();
//    console.log('done');
//},10000);