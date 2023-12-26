import { ActionRowBuilder, Interaction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Poll, reschedulePoll } from "../utility/Poll.js";
import DateFuncions from "../utility/DateFunctions.js";

export default class ScheduleModal extends ModalBuilder {
    private id:string;
    private title:string;
    
    private timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    private endDateInput = new TextInputBuilder()
        .setCustomId("EndDateInput")
        .setLabel(`End Date in ${this.timezone} (mm/dd/yyyy)`)
        .setRequired(true)
        .setMinLength(10)
        .setMaxLength(10)
        .setStyle(TextInputStyle.Short);
    
    private endTimeInput = new TextInputBuilder()
        .setCustomId("EndTimeInput")
        .setLabel(`End Time in ${this.timezone} (hh:mm)`)
        .setRequired(true)
        .setMinLength(5)
        .setMaxLength(5)
        .setStyle(TextInputStyle.Short);
    
    constructor(poll:Poll) {
        super();

        const { date, time } = DateFuncions.stringifyDateTime(poll.endDate);
        this.endDateInput.setValue(date);
        this.endTimeInput.setValue(time);

        this.id = `Schedule:${poll.id}`;
        this.title = `Reschedule "${poll.title}"`;

        this.build();
    }

    private build() {
        this.setCustomId(this.id);
        this.setTitle(this.title);

        const r1 = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(this.endDateInput);
        const r2 = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(this.endTimeInput);
        this.addComponents(r1, r2);
    }

    public static async submit(
        interaction:Interaction,
        poll:Poll
    ) {
        if(!interaction.isModalSubmit()) return;

        const date = interaction.fields.getTextInputValue("EndDateInput");
        const time = interaction.fields.getTextInputValue("EndTimeInput");

        if(!date || !time) {
            await interaction.reply({ 
                content: 'There was an error while submiting this modal!', 
                ephemeral: true 
            });
            return;
        }

        const dateTime = DateFuncions.parseDateTime(date, time);
        if(!dateTime || dateTime.getTime() < Date.now()) {
            await interaction.reply({ 
                content: 'Invalid date/time', 
                ephemeral: true 
            });
            return;
        }

        reschedulePoll(poll, dateTime);

        const msg =  `The poll "${poll.title}" was rescheduled by ${interaction.user.tag} to end on ${DateFuncions.convertToDiscordTime(poll.endDate)}`;
        await interaction.reply({
            content: msg
        });
    }
}