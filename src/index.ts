import dotenv from "dotenv";
import { Client, IntentsBitField } from "discord.js";
import { register } from "./register-commands";

dotenv.config();
const client = new Client({
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});
client.login(process.env.TOKEN);

client.once("ready", () => {
    register();
})