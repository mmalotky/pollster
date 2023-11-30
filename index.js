import dotenv from "dotenv";
dotenv.config();

import { Client, IntentsBitField } from "discord.js";
const client = new Client({
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});
client.login(process.env.DISCORD_TOKEN);

client.on("messageCreate", async (message) => {
    if(message.author.bot) return;

    if(message.content === "!test") {
        message.reply("Hello, World!");
    }
})