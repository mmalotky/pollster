import dotenv from "dotenv";
import { Client, IntentsBitField, Events } from "discord.js";
import CommandsHandler from "./CommandsHandler.js";

class Init {
	private client = new Client({
		intents:[
			IntentsBitField.Flags.Guilds,
			IntentsBitField.Flags.GuildMembers,
			IntentsBitField.Flags.GuildMessages,
			IntentsBitField.Flags.MessageContent
		]
	});
	private commandsHandler = new CommandsHandler();

	main() {
		dotenv.config();
		this.client.login(process.env.TOKEN);


		this.client.once(Events.ClientReady, () => {
			console.log("[INFO] Pollster Starting");
			this.commandsHandler.register();
			this.handleCommands();
			console.log("[INFO] Pollster Online")
		});
	}

	handleCommands() {
		this.client.on(Events.InteractionCreate, async (interaction) => {
			if(!interaction.isChatInputCommand()) return;
			const command = this.commandsHandler
				.getCommands()
				.filter(c => c.getData().name === interaction.commandName)[0];
		
			if (!command) {
				console.error(`[ERR] No command matching ${interaction.commandName} was found.`);
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
	}
}
new Init().main();


