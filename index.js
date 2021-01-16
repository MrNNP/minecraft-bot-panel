const db = require('./database.js');

global.database = db.parsed;
const { Discord, User, bot } = require('./prototypes.js');
var DiscBot = new bot();
const prefix = '_'

DiscBot.onMessage(async (msg)=>{
    if(!msg.author.bot&&msg.content.startsWith(prefix)){
        let args = msg.content.substring(1).split(" "); 
        try {
            switch (args[0]){
                case 'join':
                    if(dbgetObj({id:msg.author.id})==-1){
                    msg.channel.send('Welcome to MinecraftAFKBot '+msg.author.tag+'! \n Please run _setup [server ip] [username] [password(optional)] to set up your bot.');
                    new User({id:msg.author.id});
                    } else {
                        msg.channel.send('You only need to run _start once. You might be looking to run _setup [server ip] [username] [password(optional)] to set up your bot.');
                        msg.channel.send('You can run _setup multiple times to change your bot config.');
                    }
                break;
                case 'setup':
                    if(dbgetObj({id:msg.author.id})==-1){
                        msg.channel.send('You need to run _join to use this bot.');
                    }else{
                    try{
                let optionObj = {
                    bot:{
                        username:args[2],
                        password:args[3],
                        server:{
                            ip:args[1],
                            port:'25565'
                        }
                    }
                }
                
                database.users[dbgetObj({id:msg.author.id})] = {
                    id:msg.author.id,
                    options:optionObj
                };
                msg.channel.send('Success, now use _start to start your bot!');
                }catch(e){
                    msg.channel.send('Make sure to include all the parameters. Format is _setup [server ip] [username] [password(optional)]');
                }
            }
            break;
        }
        } catch (error) {
            console.error(error);
        }
    }
});






setInterval(()=>{db.update(database)},10000);

