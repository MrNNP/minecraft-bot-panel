const port = process.env.PORT || 3000
const express = require('express')
const db = require('./database.js');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World! 2.0')
  })
   
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });
  
  
global.database = db.parsed;
const { Discord, User, bot, mclient } = require('./prototypes.js');
var DiscordBot = new bot();
const prefix = '_';

global.toDiscord = DiscordBot.sendMessageTo;
global.toDiscord.helpEmbed = DiscordBot.helpEmbed;

DiscordBot.onMessage(async (msg)=>{
    if(!msg.author.bot&&msg.content.startsWith(prefix)){
        let args = msg.content.substring(1).split(" "); 
        try {
            switch (args[0]){
                case 'join':
                    if(dbgetObjIndex({id:msg.author.id})==-1){
                    msg.channel.send('Welcome to MinecraftAFKBot '+msg.author.tag+'! \n Please run _setup [server ip] [Your minecraft username] [username] [password(optional)] to set up your bot.');
                    new User({id:msg.author.id});
                    } else {
                        msg.channel.send('You only need to run _join once. You might be looking to run _setup [server ip] [Your minecraft username] [username] [password(optional)] to set up your bot.');
                        msg.channel.send('You can run _setup multiple times to change your bot config.');
                    }
                break;
                case 'setup':
                    if(dbgetObjIndex({id:msg.author.id})==-1){
                        msg.channel.send('You need to run _join to use this bot.');
                    }else{
                    try{
                let optionObj = {
                    bot:{
                        username:args[3],
                        password:args[4],
                        owner:args[2],
                        server:{
                            ip:args[1],
                            port:'25565'
                        }
                    }
                }
                
                database.users[dbgetObjIndex({id:msg.author.id})] = {
                    id:msg.author.id,
                    channel:msg.channel.id,
                    options:optionObj
                };
                msg.channel.send(`Success, now use _start to start your bot! \n Bot was bound to channel ${msg.channel.name}`);
                }catch(e){
                    msg.channel.send('Make sure to include all the parameters. Format is _setup [server ip] [Your minecraft username] [username] [password(optional)]');
                }
            }
            break;
                case 'start':
                    if(dbgetObjIndex({id:msg.author.id})==-1||!database.users[dbgetObjIndex({id:msg.author.id})].channel){
                        msg.channel.send('You need to run _join and _setup to use this command.');
                    } else{
                        new mclient(database.users[dbgetObjIndex({id:msg.author.id})],args[1]);
                        //console.log(database.users[dbgetObjIndex({id:msg.author.id})].options.bot.server.ip);
                    }
                    break;
                case 'stop':
                    mclient.stop(database.users[dbgetObjIndex({id:msg.author.id})]);
                    break;
                case 'help':
                msg.channel.send(toDiscord.helpEmbed);
                break;
            }
        } catch (error) {
            console.error(error);
        }
    }
});



setInterval(()=>{db.update(database)},10000);

