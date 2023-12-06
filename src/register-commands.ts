require("dotenv").config();
const { REST, Routes, Collection } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const commandFolderPath = path.join(__dirname, 'commands');
const commandsFolder = fs.readdirSync(commandFolderPath);
module.exports.commands = new Collection();
let commandsJSON = new Array();
for( const file of commandsFolder) {
    const filePath = path.join(commandFolderPath, file);
    const command = require(filePath);
    module.exports.commands.set(command.data.name, command);
    commandsJSON.push(command.data.toJSON());
}

const rest = new REST({version:'10'});
if(process.env.TOKEN) rest.setToken(process.env.TOKEN);
else console.log("No token found");

module.exports.register = () => {
    try {
        console.log("Registering commands...");

        if(process.env.CLIENT_ID && process.env.SERVER_ID) {
            rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.SERVER_ID),
                {body: commandsJSON}
            )

            console.log("...Commands Registered");
        }
        else console.log("Client/ Server ID's not Found");
    }
    catch(err) {console.log(err)};
};