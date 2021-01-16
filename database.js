const fs = require('fs');
var Ldatabase = require('./database.json');

module.exports.parsed =Ldatabase;
module.exports.update = async function(db)
{

    Ldatabase = db;  
    writeToFile(db);

};

async function writeToFile(Sdatabase){

await fs.writeFileSync('./database.json',JSON.stringify(Sdatabase));
return;
 
};

global.dbdeleteObj = function (userObject) {
    let indexOfObj = database.users.findIndex((element)=>{
        return element.id == userObject.id
        });

    database.users.splice(indexOfObj,1);
    return;
}
global.dbgetObj = (userObject)=>{
    return database.users.findIndex((element)=>{
        return element.id == userObject.id
        });
}


