require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const { register } = require("./register-commands.ts");

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