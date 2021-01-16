var mineflayer = require("mineflayer");

var bloodhoundPlugin = require("mineflayer-bloodhound");

var mineflayer_pathfinder_1 = require("mineflayer-pathfinder");

var mineflayer_pathfinder_2 = require("mineflayer-pathfinder");

var GoalFollow = mineflayer_pathfinder_2.goals.GoalFollow;

var autoeat = require("mineflayer-auto-eat");

class client {
followUser = (playerToFollow,username)=>{
    this.bot.whisper(username, 'On my way');
    this.bot.pathfinder.setGoal(new GoalFollow(playerToFollow, 2), true);
}
onHealthChange = ()=>{
        this.bot.on('health', function () {
            
            if (bot.food === 15) {
                
                bot.autoEat.disable();
            } else {
                bot.autoEat.enable();
            };
        });

} 
onWhisper = ()=>{
        this.bot.on('whisper', function (username, message) {
            if (username === this.bot.username)
            return;
            try {
                var playerToFollow = this.bot.players[username].entity;
                if (username === this.owner) {
                    switch (message) {
                        case "follow me":
                            followOwner(playerToFollow, username);
                            break;
                            case "stop":
                                this.bot.pathfinder.setGoal(null);
                                break;
                            };
                        } else if (username !== this.owner) {
                            bot.whisper(username, 'Sorry, I am an AFK Bot');
                        };
                    } catch (err) {
                        console.log("An error occurred when attempting to pathfind:\n            Something to check:\n            Make sure you are close to the bot\n            Make sure the bot is not already pathfinding to something\n\n            The process was not terminated because the error is not critical, so you can attempt to resolve the error and \n            try again without restart\n\n            Heres the error:    \n            " + err);
                    };
                    //Error handling
                });
}
onDisconnect = ()=>{
                this.bot.on('kicked', function (reason) {
                    //Parse response from server
                    let reasonKicked = JSON.parse(reason);
                    //Return if response empty
                    if (!reasonKicked.extra)
                    return;
                    if (reasonKicked.extra[0].text.includes('banned')) {
                        //Check if bot was banned
                        console.log(' <STATUS> I got banned. Exiting in 5 seconds...');
                        //Exit process if banned 
                        
                    } else {
                        //If message does not include banned, then tell user and attempt to connect again set timeout
                        console.log(" <STATUS> I got kicked. Reconnecting in 5 seconds. Reason: " + reasonKicked.extra[0].text);
                        //Reset bot and retry joining
                        
                    };
                });
}
onDeath = ()=>{
                this.bot.on('death', function () {
                    console.log(" <STATUS> I died!");
                });
}
onRespawn = ()=>{
                this.bot.on('respawn', function () {
                    console.log(" <STATUS> Respawned at x: " + Math.round(bot.entity.position.x) + " y: " + Math.round(bot.entity.position.y) + " z: " + Math.round(bot.entity.position.z));
                });
}
onAttacked = ()=>{
                this.bot.on('onCorrelateAttack', function (attacker, victim, weapon) {
                    if (this.bot.username === victim.username) {
                        if (weapon) {
                            console.log(" <STATUS> Got hurt by " + (attacker.displayName || attacker.username) + " with a/an " + weapon.displayName);
                        } else {
                            console.log(" <STATUS> Got hurt by " + (attacker.displayName || attacker.username));
                        };
                    };
                });
}
lookNearEntity = ()=>{
                setInterval(function () {
                    var entity = this.bot.nearestEntity();
                    if (entity !== null) {
                        if (entity.type === 'player') {
                            this.bot.lookAt(entity.position.offset(0, 1.6, 0));
                        } else if (entity.type === 'mob') {
                            this.bot.lookAt(entity.position);
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

constructor(ip,port,username,password=null,owner){
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
    this.bot.bloodhound.yaw_correlation_enabled = true
    
    this.bot.loadPlugin(pathfinder);
    
    this.bot.loadPlugin(autoeat);
     
    var mcData = require('minecraft-data')(bot.version);
    var defaultMove = new mineflayer_pathfinder_1.Movements(bot, mcData);
    defaultMove.allowFreeMotion = true;
    this.bot.pathfinder.setMovements(defaultMove);

    this.bot.autoEat.options = {
        priority: "foodPoints",
        startAt: 15,
        bannedFood: [],
    };
    this.#intialize();
}
}