
const Discord = require('discord.js');
const database = require('./database');
const token = 'Nzk5ODQxMDU3NTQxODQ5MTcw.YAJcCA.p5IrMf3aOc8hjHFIx8b-jOx97fc';
//const { fork } = require('child_process');
const mcclient = require('./bot instance/new').Client;
//const threadHandlerclass = require('./threadHandler.js');
//var threadHandler = new threadHandlerclass;

var clients = [];

class bot {
    
    
    constructor(){
        this.client = new Discord.Client();
        
        this.helpEmbed = new Discord.MessageEmbed()
        .setTitle('Help embed')
        .setColor(randColor())
        .addFields(
            { name:'*What* does the bot do?', value:'This is an afk bot for minecraft. The main thing that this bot does is it \n joins a MC server as a user, allowing you to avoid having to leave your computer/minecraft on when afking.' },
            { name:'*How* do I use the bot?', value:'There are 3 simple steps to use this bot. First, type `_join` to start. Next, type \n`_setup [server ip] [your username] [bot username] [password(optional)]`. \n Finally, type `_start` to start the bot and `_stop` to stop it.' },
            { name:'*How* do I change my config?', value:'The _setup command can be run multiple times to change your config.',inline:true },
            { name:'*Do* I need to use a mojang account to use this bot?', value:'This bot supports both offical and offline/cracked accounts. In order to use a offical account, which can connect to non-cracked servers you will need to provide the account username and password in the appropriate fields in _setup'},
            { name:'*How* secure is my password?',value:'You might notice that the `_setup` and `_start` have a password field. This is for your mojang account password. The password fields are both optional because the bot supports offline/cracked servers, where you would not input a password at all. The password field in `_setup` is saved to config, and the field in `_start` is not. This is to give an option to people that do not want to have their password saved. If you are going to use a password, I recommend setting up the bot in a dm, not in a server.'},
            { name:'*Why* are there two username fields in _setup?', value:"The bot supports ingame commands like `follow me`, and it needs a username who's commands to listen to. The [your username] is the field to put this username. The [bot username] field is where you put the username the bot will have ingame."},
            { name:'Ingame commands',value:'Commands you can use when whispering to the bot.\n Hint: You can use `/tell`,`/msg`, or `/w` to whisper.'},
            { name:'`follow me`', value:'You need to have the bot within render distance to use this command. It simply makes the bot follow you around', inline:true},
            { name:'`stop`', value:'Makes the bot stop whatever it is doing.',inline:true }
        )
        .setTimestamp()
        .setFooter('Put a link here','https://discord.com');


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
        let embed;
        try{
        switch(content.intent){
             case 'spawn':
                embed = new Discord.MessageEmbed()
                .setTitle('I spawned:')
                .setColor(randColor())
                .addFields(
                    { name:'**X** position', value:Math.round(content.data.x),inline:true },
                    { name:'**Y** position', value:Math.round(content.data.y),inline:true },
                    { name:'**Z** position', value:Math.round(content.data.z),inline:true }
                )
                .setTimestamp()
                .setFooter('Put a link here','https://discord.com');
                 break;
             case 'death':
                 console.log(content.data.killer);
                embed = new Discord.MessageEmbed()
                .setTitle('I died:')
                .setColor(randColor())
                .addFields(
                    { name:'Person/thing that prob killed me', value:!!content.data.killer ? 'unknown' : content.data.killer}
                )
                .setTimestamp()
                .setFooter('Put a link here','https://discord.com');
                 break;
             case 'whisper':
                embed = new Discord.MessageEmbed()
                .setTitle('I was whispered to:')
                .setColor(randColor())
                .addFields(
                    { name:'Whisperer', value:content.data.username,inline:true },
                    { name:'Message', value:content.data.content,inline:true}
                )
                .setTimestamp()
                .setFooter('Put a link here','https://discord.com');
                 break;
             case 'respawn':
                embed = new Discord.MessageEmbed()
                .setTitle('I respawned/went into a different dimension:')
                .setColor(randColor())
                .addFields(
                    { name:'X position', value:content.data.x,inline:true },
                    { name:'Y position', value:content.data.y,inline:true },
                    { name:'Z position', value:content.data.z,inline:true }
                    //{ name:'Dimension', value:content.data.dim,inline:true }
                )
                .setTimestamp()
                .setFooter('Put a link here','https://discord.com');
                 break;
             case 'disconnect':
                
                embed = new Discord.MessageEmbed()
                .setTitle('I was disconnected:')
                .setColor(randColor())
                .addFields(
                    { name:'Reason', value:content.data.reason,inline:true },
                    { name:'Did I get banned?', value:content.data.ban,inline:true}
                )
                .setTimestamp()
                .setFooter('Put a link here','location to put');
                  break;
             case 'whisper':
                    embed = new Discord.MessageEmbed()
                    .setTitle('Chat message')
                    .setColor(randColor())
                    .addFields(
                        { name:'Username', value:content.data.username,inline:true },
                        { name:'Message', value:content.data.content,inline:true}
                    )
                    .setTimestamp()
                    .setFooter('Put a link here','https://discord.com');
                     break;
             default:
                embed = new Discord.MessageEmbed()
                .setTitle(content.data.content)
                .setColor(randColor())
                .setTimestamp()
                .setFooter('Put a link here','https://discord.com');
                 break;

        }

       
           let channel =
            client.users.cache.get(id);
            channel.send(embed);
       }catch(e){console.log(e);} 
        try{
            let channel = 
            client.channels.cache.get(id);
            channel.send(embed);

        
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
constructor(userObj,pswd){
    this.user = userObj;
    clients.push({
        client:new mcclient(
            {
                output:(msg)=>{
                    toDiscord(this.user.channel,msg)
                },
                quitSelf:(data)=>{
                    let clientid = clients.findIndex((value =>{value.user.id == data.data.id}));
                    clients[clientid].client.quit();         
                    clients.splice(clientid,1);
                }
            },
            userObj.id,userObj.options.bot.server.ip,25565, userObj.options.bot.username,
            userObj.options.bot.password,userObj.options.bot.owner

        ),
        user:userObj

    });
}
static stop = (userObj) => {
    let clientid = clients.findIndex((value =>{value.user.id == userObj.id}));
                    clients[clientid].client.quit();         
                    clients.splice(clientid,1);
    //threadHandler.stop(userObj);
    
}


}
module.exports.Discord = Discord;
module.exports.bot = bot;
module.exports.User = User;
module.exports.mclient = mclient;
function randColor(){
     // storing all letter and digit combinations 
    // for html color code 
    var letters = "0123456789ABCDEF"; 
  
    // html color code starts with # 
    var color = '#'; 
  
    // generating 6 times as HTML color code consist 
    // of 6 letter or digits 
    for (var i = 0; i < 6; i++) {
       color += letters[(Math.floor(Math.random() * 16))];
    }
    return color;
    }
