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
                            bot.whisper(username, 'Im AFK');
                        };
                        logger({
                            intent:'whisper',
                            data:{
                                username:username,
                                content:message
                            }
                        });
                    } catch (err) {
                        logger("An error occurred when attempting to pathfind:\n            Something to check:\n            Make sure you are close to the bot\n         Make sure the bot is not already pathfinding to something\n\n            The process was not terminated because the error is not critical, so you can attempt to resolve the error and \n            try again without restart\n\n            Heres the error:    \n            " + err);
                    };
                    //Error handling
                });
}
onChat = ()=>{
    let bot = this.bot;
    this.bot.on('chat',(username,message)=>{
       
        try {
                logger({
                        intent:'chat',
                        data:{
                            username:username?'server/admin':username,
                            content:message
                        }
                    });
                } catch (err) {
                    console.log(err);
                }
});
}
onDisconnect = ()=>{
    //let bot = this.bot;
    let logger = this.logger;
    let quitSelf = this.quitSelf;
    let id = this.id;
                this.bot.on('kicked', function (reason) {
                    //Parse response from server
                    let reasonKicked = JSON.parse(reason);
                    //Return if response empty
                    if (!reasonKicked.extra)
                    return;
                    if (reasonKicked.extra[0].text.includes('banned')) {
                        //Check if bot was banned
                        logger({
                            intent:'disconnect',
                            data:{
                                reason:reasonKicked.extra[0].text,
                                ban:true
                            }
                        });
                        //Exit process if banned 
                        
                    } else {
                        //If message does not include banned, then tell user and attempt to connect again set timeout
                        logger({
                            intent:'disconnect',
                            data:{
                                reason:reasonKicked.extra[0].text,
                                ban:false
                            }
                        });
                        //Reset bot and retry joining
                        
                    };
                    quitSelf({data:{id:id}});
                });
}
onDeath = ()=>{
    let logger = this.logger;
    let lastAttack = this.lastAttacker;
                this.bot.on('death', function () {
                    logger({
                        intent:'death',
                        data:{
                            killer:lastAttack
                        }
                    });
                });
}
onRespawn = ()=>{
    let bot = this.bot;
    let logger = this.logger;
                this.bot.on('respawn', function () {
                    logger({
                        intent:'respawn',
                        data:{
                            x:Math.round(bot.entity.position.x),
                            y:Math.round(bot.entity.position.y),
                            z:Math.round(bot.entity.position.z)
                        }
                    });
                    });
}
onAttacked = ()=>{
    let bot = this.bot;
    let logger = this.logger;
    let lastAttacker = this.lastAttacker;
                bot.on('onCorrelateAttack', function (attacker, victim, weapon) {
                    if (bot.username ===  victim.username) {
                     lastAttacker = attacker.displayName;           
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
    this.onChat();
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

constructor(functs,id,ip,port,username,password=null,owner){
    this.id = id;
    this.output = functs.output;
    this.quitSelf= functs.quitSelf;
    this.owner = owner;
    this.ip = ip;
    this.port = port;
    this.username = username;
    this.password = password;
    this.lastAttacker = undefined;
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
    let bot = this.bot;
    this.logger({
        intent:'spawn',
        data:{
            x:bot.entity.position.x,
            y:bot.entity.position.y,
            z:bot.entity.position.z,
            dim:bot.entity.position.dim
        }
    });
    });
}
}

module.exports.Client = client;