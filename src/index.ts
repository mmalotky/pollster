import * as dotenv from "dotenv";
import { Client, IntentsBitField, Events } from "discord.js";
import CommandsHandler from "./CommandsHandler.js";
import NewPollModal from "./components/NewPollModal.js";
import NewPollReturnButton from "./components/NewPollReturnButton.js";
import { DataHandlerObject } from "./DataHandler.js";

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
			this.handleModals();
			this.handleButtons();
			console.log("[INFO] Pollster Online")
		});
	}

	private handleCommands() {
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
					await interaction.followUp({ 
						content: 'There was an error while executing this command!', 
						ephemeral: true 
					});
				} else {
					await interaction.reply({ 
						content: 'There was an error while executing this command!', 
						ephemeral: true 
					});
				}
			}
		});
	}

	private handleModals() {
		this.client.on(Events.InteractionCreate, async (interaction) => {
			if(!interaction.isModalSubmit()) return;
			const modalId = interaction.customId;

			if(modalId.startsWith("NewPollModal")) {
				await NewPollModal.submit(interaction);
			}
		});
	}

	private handleButtons() {
		this.client.on(Events.InteractionCreate, async (interation) => {
			if(!interation.isButton()) return;
			const buttonId = interation.customId;

			if(buttonId.startsWith("NewPollReturn")) {
				const dataID = buttonId.substring(14);
				const payload = DataHandlerObject.getNewPoll(dataID);

				if(payload) {
					await NewPollReturnButton.submit(interation, payload);
				}
				else {
					console.log(`[ERR] New Poll ${dataID} data not found.`);
					await interation.reply({
						content:"Poll data was lost or corrupted. Please make a new poll.",
						ephemeral:true
					})
				}
			}
		});
	}
}

new Init().main();


