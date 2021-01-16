const Discord = require('discord.js');
const db = require('./database.js'); 

var database = db();



setInterval(()=>{db.update(database)},10000);

