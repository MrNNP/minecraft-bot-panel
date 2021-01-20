var mineflayer = require("mineflayer");

var bloodhoundPlugin = require("mineflayer-bloodhound");


var pathfinder = require("mineflayer-pathfinder").pathfinder;
var Movements = require('mineflayer-pathfinder').Movements;

var GoalFollow = require("mineflayer-pathfinder").goals.GoalFollow;

var autoeat = require("mineflayer-auto-eat");

class client {
followUser = (playerToFollow,username)=>{
    this.bot.whisper(username, 'On my way');
    this.bot.pathfinder.setGoal(new GoalFollow(playerToFollow, 2), true);
}
onHealthChange = ()=>{
    let bot = this.bot;
        this.bot.on('health', function () {
            
            if (bot.food === 15) {
                
                bot.autoEat.disable();
            } else {
                bot.autoEat.enable();
            };
        });

} 
onWhisper = ()=>{
    let bot = this.bot;
    let owner = this.owner;
    let logger = this.logger;
    let followUser = this.followUser;
        this.bot.on('whisper', function (username, message) {
            if (username === bot.username)
            return;
            try {
                var playerToFollow = bot.players[username].entity;
                if (username === owner) {
                    switch (message) {
                        case "follow me":
                            followUser(playerToFollow, username);
                            break;
                            case "stop":
                                bot.pathfinder.setGoal(null);
                                break;
                            };
                        } else if (username !== owner) {
                            bot.whisper(username, 'Sorry, I am an AFK Bot');
                        };
                    } catch (err) {
                        logger("An error occurred when attempting to pathfind:\n            Something to check:\n            Make sure you are close to the bot\n         Make sure the bot is not already pathfinding to something\n\n            The process was not terminated because the error is not critical, so you can attempt to resolve the error and \n            try again without restart\n\n            Heres the error:    \n            " + err);
                    };
                    //Error handling
                });
}
onChat = (username,message)=>{
    if (username){
  this.logger(`Message from ${username}:  ${message}`)  
    }
}
onDisconnect = ()=>{
    let bot = this.bot;
    let logger = this.logger;
                this.bot.on('kicked', function (reason) {
                    //Parse response from server
                    let reasonKicked = JSON.parse(reason);
                    //Return if response empty
                    if (!reasonKicked.extra)
                    return;
                    if (reasonKicked.extra[0].text.includes('banned')) {
                        //Check if bot was banned
                        logger(' <STATUS> I got banned. Exiting in 5 seconds...');
                        //Exit process if banned 
                        
                    } else {
                        //If message does not include banned, then tell user and attempt to connect again set timeout
                        logger(" <STATUS> I got kicked. Reconnecting in 5 seconds. Reason: " + reasonKicked.extra[0].text);
                        //Reset bot and retry joining
                        
                    };
                });
}
onDeath = ()=>{
    let logger = this.logger;
                this.bot.on('death', function () {
                    logger(" <STATUS> I died!");
                });
}
onRespawn = ()=>{
    let bot = this.bot;
    let logger = this.logger;
                this.bot.on('respawn', function () {
                    logger(" <STATUS> Respawned at x: " + Math.round(bot.entity.position.x) + " y: " + Math.round(bot.entity.position.y) + " z: " + Math.round(bot.entity.position.z));
                });
}
onAttacked = ()=>{
    let bot = this.bot;
    let logger = this.logger;
                bot.on('onCorrelateAttack', function (attacker, victim, weapon) {
                    if (bot.username === victim.username) {
                        if (weapon) {
                            logger(" <STATUS> Got hurt by " + (attacker.displayName || attacker.username) + " with a/an " + weapon.displayName);
                        } else {
                            logger(" <STATUS> Got hurt by " + (attacker.displayName || attacker.username));
                        };
                    };
                });
}
lookNearEntity = ()=>{
    let bot = this.bot;
                setInterval(function () {
                    var entity = bot.nearestEntity();
                    if (entity !== null) {
                        if (entity.type === 'player') {
                            bot.lookAt(entity.position.offset(0, 1.6, 0));
                        } else if (entity.type === 'mob') {
                            bot.lookAt(entity.position);
                        };
                    };
                }, 100);
}

#intialize = () =>{
    this.onHealthChange();
    this.onWhisper();
    this.onDisconnect();
    this.onDeath();
    this.onRespawn();
    this.onAttacked();
    this.lookNearEntity();
}

logger = (data)=>{
    let discordOutput = {
        id:this.id,
        intent:'discord',
        data:{
            response:data
        }
    }
    
    this.output(discordOutput);

}

constructor(outputfunct,id,ip,port,username,password=null,owner){
    this.id = id;
    this.output = outputfunct;
    this.owner = owner;
    this.ip = ip;
    this.port = port;
    this.username = username;
    this.password = password;
    this.bot = mineflayer.createBot({

        host: this.ip,
        username: this.username,
        password: this.password,
        hideErrors: true
    });
    
    bloodhoundPlugin(this.bot);

    //this.bot.bloodhound.yaw_correlation_enabled = true
    
    this.bot.loadPlugin(pathfinder);
    
    this.bot.loadPlugin(autoeat);
    
    this.bot.once('spawn',()=>{

    this.mcData = require('minecraft-data')(this.bot.version);
    var defaultMove = new Movements(this.bot, this.mcData);
    defaultMove.allowFreeMotion = true;
    this.bot.pathfinder.setMovements(defaultMove);

    this.bot.autoEat.options = {
        priority: "foodPoints",
        startAt: 15,
        bannedFood: [],
    };
    this.#intialize();
    this.logger('started')
    });
}
}

module.exports.Client = client;