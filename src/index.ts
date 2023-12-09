import dotenv from "dotenv";
import { Client, IntentsBitField, Events } from "discord.js";
import CommandsHandler from "./CommandsHandler.js";
import NewPollModal from "./components/NewPollModal.js";

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

	handleModals() {
		this.client.on(Events.InteractionCreate, async (interaction) => {
			if(!interaction.isModalSubmit()) return;
			const modalId = interaction.customId;

			if(modalId.startsWith("NewPollModal")) {
				const errors:string[] = [];

				const title = interaction.fields.getTextInputValue("TitleInput");
				const options = interaction.fields.getTextInputValue("OptionsInput");
				const date = interaction.fields.getTextInputValue("EndDateInput");
				const time = interaction.fields.getTextInputValue("EndTimeInput");

				if(!title || !options || !date || !time) {
					await interaction.reply({ content: 'There was an error while submiting this modal!', ephemeral: true });
					return;
				}

				const optionsValue = parseInt(options);
				if(!optionsValue || optionsValue < 1) errors.push("Options");

				const dateTime = this.parseDateTime(date, time);
				if(!dateTime || dateTime.getTime() < Date.now()) errors.push("Date", "Time");

				if(errors.length > 0) {
					await interaction.reply({content: `Invalid New Poll: ${errors}`, ephemeral: true});
				}
				else {
					await interaction.reply({
						content: `Valid New Poll: {title:${title},options:${options},ends:${dateTime}}`, 
						ephemeral: true
					});
				}
			}
		})
	}

	private parseDateTime(date:string, time:string) {
		const reDate = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
		const reTime = /^[0-9]{2}:[0-9]{2}$/;
		if(!date.match(reDate) || !time.match(reTime)) {
			console.log("[ERR] Invalid date or time.");
			return;
		}
		const dateValues = date.split("/");
		const timeValues = time.split(":");

		const month = parseInt(dateValues[0]);
		if(month < 1 || month > 12) {
			console.log("[ERR] Invalid Month");
			return;
		}
		const day = parseInt(dateValues[1]);
		if(day < 1 || day > 31) {
			console.log("[ERR] Invalid date");
			return;
		}
		const hour = parseInt(timeValues[0]);
		if(hour < 0 || hour > 24) {
			console.log("[ERR] Invalid Hour")
			return;
		}
		const minute = parseInt(timeValues[1]);
		if(minute < 0 || minute > 59) {
			console.log("[ERR] Invaild Minute");
			return;
		}
		
		const dateTimeFormat = `${dateValues[2]}-${dateValues[0]}-${dateValues[1]}T${timeValues[0]}:${timeValues[1]}`;
		const dateTime = new Date(dateTimeFormat);
		if(isNaN(dateTime.getTime())) {
			console.log("[ERR] Could not parse date: " + dateTimeFormat);
			return;
		}
		
		return dateTime;
	}
}
new Init().main();


