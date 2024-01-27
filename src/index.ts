import * as dotenv from "dotenv";
import { Client, IntentsBitField, Events, ButtonInteraction, StringSelectMenuInteraction, ModalSubmitInteraction, Interaction } from "discord.js";
import CommandsHandler from "./handlers/CommandsHandler.js";
import NewPollModal from "./components/NewPollModal.js";
import NewPollReturnButton from "./components/NewPollReturnButton.js";
import { DataHandlerObject } from "./handlers/DataHandler.js";
import StartPollButton from "./components/StartPollButton.js";
import PollMenu from "./components/PollMenu.js";
import { Poll } from "./utility/Poll.js";
import ScheduleModal from "./components/ScheduleModal.js";
import ActivePollsMenu from "./components/ActivePollsMenu.js";

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
			this.handleMenuInteractions();
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
			else if(modalId.startsWith("Schedule")) {
				const dataID = modalId.substring(9);
				this.pollDataInteraction(dataID, ScheduleModal.submit, interaction);
			}
		});
	}

	private handleButtons() {
		this.client.on(Events.InteractionCreate, async (interaction) => {
			if(!interaction.isButton()) return;
			const buttonId = interaction.customId;

			if(buttonId.startsWith("NewPollReturn")) {
				const dataID = buttonId.substring(14);
				this.pollDataInteraction(dataID, NewPollReturnButton.submit, interaction);
			}

			if(buttonId.startsWith("StartPoll")) {
				const dataID = buttonId.substring(10);
				this.pollDataInteraction(dataID, StartPollButton.submit, interaction);
			}
		});
	}

	private handleMenuInteractions() {
		this.client.on(Events.InteractionCreate, async (interaction) => {
			if(!interaction.isStringSelectMenu()) return;
			const menuID = interaction.customId;

			if(menuID.startsWith("Poll")) {
				const dataID = menuID.substring(5);
				this.pollDataInteraction(dataID, PollMenu.select, interaction);
			}
			else if(menuID.startsWith("Active")) {
				const dataID = interaction.values[0];
				this.pollDataInteraction(dataID, ActivePollsMenu.select, interaction);
			}
		})
	}

	private async pollDataInteraction(
		dataID:string,
		execute:(
			interaction:Interaction, 
			poll:Poll
		) => Promise<void>,
		interaction:ButtonInteraction | StringSelectMenuInteraction | ModalSubmitInteraction
	) {
		const poll = await DataHandlerObject.getPoll(dataID, interaction.channelId);

		if(poll) {
			execute(interaction, poll);
		}
		else {
			console.log(`[ERR] Poll ${dataID} data not found.`);
			interaction.reply({
				content:"Poll data was lost or corrupted. Please make a new poll.",
				ephemeral:true
			})
		}
	}
}

new Init().main();


