require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const commandFolderPath = path.join(__dirname, 'commands');
const commandsFolder = fs.readdirSync(commandFolderPath);
var commands = new Array();
for( const file of commandsFolder) {
    const filePath = path.join(commandFolderPath, file);
    const command = require(filePath);
    commands.push(command);
}

const rest = new REST({version:'10'});
if(process.env.TOKEN) rest.setToken(process.env.TOKEN);
else console.log("No token found");

module.exports.register = () => {
    try {
        console.log("Registering commands...");

        if(process.env.CLIENT_ID && process.env.GUILD_ID) {
            rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                {body: commands}
            )

            console.log("...Commands Registered");
        }
        else console.log("Client/ Server ID's not Found");
    }
    catch(err) {console.log(err)};
};