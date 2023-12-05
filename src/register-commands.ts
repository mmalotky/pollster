import { REST, Routes } from "discord.js";
import fs from "node:fs";

require("dotenv").register();

const commandFolderPath = "./commands";
const commandsFolder = fs.readdirSync(commandFolderPath);
const commands:any = [];
for( const file in commandsFolder) {
    const filePath = commandFolderPath + "/" + file;
    const command = require(filePath);
    commands.push(command);
}

const rest = new REST({version:'10'});
if(process.env.TOKEN) rest.setToken(process.env.TOKEN);
else console.log("No token found");

export async function register() {
    try {
        console.log("Registering commands...");

        if(process.env.CLIENT_ID && process.env.GUILD_ID) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                {body: commands}
            )

            console.log("...Commands Registered");
        }
        else console.log("Client/ Server ID's not Found");
    }
    catch(err) {console.log(err)};
};