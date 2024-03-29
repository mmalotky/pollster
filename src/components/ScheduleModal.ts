import { ActionRowBuilder, Interaction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Poll } from "../utility/Poll.js";
import DateFunctions from "../utility/DateFunctions.js";
import ScheduleHandler from "../handlers/ScheduleHandler.js";
import { ERR } from "../utility/LogMessage.js";

export default class ScheduleModal extends ModalBuilder {
    private id:string;
    private title:string;
    
    private timezone = DateFunctions.getTimeZone();
    
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

        const { date, time } = DateFunctions.stringifyDateTime(poll.endDate);
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
            ERR("Missing Fields");
            await interaction.reply({ 
                content: 'There was an error while submiting this modal!', 
                ephemeral: true 
            });
            return;
        }

        const dateTime = DateFunctions.parseDateTime(date, time);
        if(!dateTime || dateTime.getTime() < Date.now()) {
            await interaction.reply({ 
                content: 'Invalid date/time', 
                ephemeral: true 
            });
            return;
        }

        ScheduleHandler.reschedulePoll(poll, dateTime);

        const msg =  `The poll "${poll.title}" was rescheduled by ${interaction.user.tag} to end on ${DateFunctions.convertToDiscordTime(poll.endDate)}`;
        interaction.reply({
            content:"Success",
            ephemeral: true
        });
        interaction.deleteReply();

        await interaction.channel?.send({
            content: msg
        });
    }
}