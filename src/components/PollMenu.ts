import DataHandler from "../handlers/DataHandler.js";
import { Poll } from "../utility/Poll.js";
import { Interaction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, bold } from "discord.js";

export default class PollMenu extends StringSelectMenuBuilder {

    constructor(poll:Poll) {
        super();
        this.setCustomId(`Poll:${poll.id}`);

        const menuOptions = poll.options.map(o => {
            return new StringSelectMenuOptionBuilder()
                .setLabel(o.label)
                .setValue(o.label)
        })
        this.setOptions(menuOptions);
        this.setMinValues(0);
        this.setMaxValues(poll.options.length);
    }

    public static async select(
        interaction:Interaction,
        poll:Poll
    ) {
        if(!interaction.isStringSelectMenu()) return;

        const selections = interaction.values;
        DataHandler.vote(poll, selections, interaction.user.username);

        await interaction.reply({
            content:`${bold(poll.title)}\nYou selected: ${selections}`,
            ephemeral:true
        })

        interaction.deleteReply();
    }
}