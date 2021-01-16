const fs = require('fs');
var database = require('./database.json');

module.exports = ()=>{ return database;};
module.exports.update = async function(db)
{

    database = db;  
    writeToFile(db);

};

async function writeToFile(database){

await fs.writeFileSync('./database.json',JSON.stringify(database));
return;

};

