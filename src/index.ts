require("dotenv").config();
const { Client, IntentsBitField, Events } = require("discord.js");
const { register, commands } = require("./register-commands.ts");

const client = new Client({
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});
client.login(process.env.TOKEN);

client.once(Events.Ready, () => {
    console.log("Pollster Ready");
    register();
});

client.on(Events.InteractionCreate, async (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    const command = commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});