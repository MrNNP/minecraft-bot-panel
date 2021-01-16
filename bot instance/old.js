var mineflayer = require("mineflayer");

var bloodhoundPlugin = require("mineflayer-bloodhound");

var mineflayer_pathfinder_1 = require("mineflayer-pathfinder");

var mineflayer_pathfinder_2 = require("mineflayer-pathfinder");

var GoalFollow = mineflayer_pathfinder_2.goals.GoalFollow;

var autoeat = require("mineflayer-auto-eat");

var args = process.argv.slice(2);

//start bot with arguments passed
var bot = mineflayer.createBot({

    host: args[0],
    username: args[1] ? args[1] : 'AFKBot',
    //password: args[3]? args[3]:null,
    hideErrors: true
});
//TODO: add bot var to db?
//Initiallize Plugins
bloodhoundPlugin(bot);

bot.loadPlugin(mineflayer_pathfinder_1.pathfinder);

bot.loadPlugin(autoeat);
//Executes when bot spawns
bot.once('spawn', function () {
    //cache some data
    var mcData = require('minecraft-data')(bot.version);
    var defaultMove = new mineflayer_pathfinder_1.Movements(bot, mcData);
    defaultMove.allowFreeMotion = true;
    bot.pathfinder.setMovements(defaultMove);

    lookNearEntity();

    bot.autoEat.options = {
        priority: "foodPoints",
        startAt: 15,
        bannedFood: [],
    };
    bot.on('health', function () {

        if (bot.food === 20) {

            bot.autoEat.disable();
        } else {
            bot.autoEat.enable();
        };
    });
    bot.on('whisper', function (username, message) {
        if (username === bot.username)
            return;
        try {
            var playerToFollow = bot.players[username].entity;
            if (username === args[2]) {
                switch (message) {
                    case "follow me":
                        followOwner(playerToFollow, username);
                        break;
                    case "stop":
                        bot.pathfinder.setGoal(null);
                        break;
                };
            } else if (username !== args[2]) {
                bot.whisper(username, 'Sorry, I am an AFK Bot');
            };
        } catch (err) {
            console.log("An error occurred when attempting to pathfind:\n            Something to check:\n            Make sure you are close to the bot\n            Make sure the bot is not already pathfinding to something\n\n            The process was not terminated because the error is not critical, so you can attempt to resolve the error and \n            try again without restart\n\n            Heres the error:    \n            " + err);
        };
        //Error handling
    });
    //Runs when bot is kicked
    bot.on('kicked', function (reason) {
        //Parse response from server
        var reasonKicked = JSON.parse(reason);
        //Return if response empty
        if (!reasonKicked.extra)
            return;
        if (reasonKicked.extra[0].text.includes('banned')) {
            //Check if bot was banned
            console.log(' <STATUS> I got banned. Exiting in 5 seconds...');
            //Exit process if banned 
            setTimeout(function () {
                process.exit(1);
            }, 5000);
        } else {
            //If message does not include banned, then tell user and attempt to connect again set timeout
            console.log(" <STATUS> I got kicked. Reconnecting in 5 seconds. Reason: " + reasonKicked.extra[0].text);
            //Reset bot and retry joining
            setTimeout(function () {}, 5000);
        };
    });
    bot.on('death', function () {
        console.log(" <STATUS> I died!");
    });
    bot.on('respawn', function () {
        console.log(" <STATUS> Respawned at x: " + Math.round(bot.entity.position.x) + " y: " + Math.round(bot.entity.position.y) + " z: " + Math.round(bot.entity.position.z));
    });
    //When attacked inform user of attacker, who was attacked and with what
    bot.on('onCorrelateAttack', function (attacker, victim, weapon) {
        if (bot.username === victim.username) {
            if (weapon) {
                console.log(" <STATUS> Got hurt by " + (attacker.displayName || attacker.username) + " with a/an " + weapon.displayName);
            } else {
                console.log(" <STATUS> Got hurt by " + (attacker.displayName || attacker.username));
            };
        };
    });
    setInterval(function () {
        setTimeout(function () {
            bot.setControlState('jump', false);
        }, 100);
        bot.setControlState('jump', true);
    }, 100000);
});

function lookNearEntity() {
    setInterval(function () {
        var entity = bot.nearestEntity();
        if (entity !== null) {
            if (entity.type === 'player') {
                bot.lookAt(entity.position.offset(0, 1.6, 0));
            } else if (entity.type === 'mob') {
                bot.lookAt(entity.position);
            };
        };
    }, 50);
};

function followOwner(playerToFollow, username) {
    bot.whisper(username, 'On my way');
    bot.pathfinder.setGoal(new GoalFollow(playerToFollow, 2), true);
};
//# sourceMappingURL=index.js.map