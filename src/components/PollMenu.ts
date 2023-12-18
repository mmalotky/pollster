import { Poll } from "../utility/Poll.js";
import { ButtonInteraction, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder } from "discord.js";

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
        interaction:ButtonInteraction | StringSelectMenuInteraction,
        poll:Poll
    ) {
        if(!interaction.isStringSelectMenu()) return;
        const selections = interaction.values;
        for(const selection of selections) {
            const option = poll.options.find(o => o.label === selection);
            if(option) {
                option.votes.add(interaction.user.id);
            }
            else {
                console.log(`[ERR]: Option ${selection} does not exist in Poll ${poll.id}`)
            }
        }
        
        const unselected = poll.options.filter(o => !selections.includes(o.label));
        for(const option of unselected) {
            option.votes.delete(interaction.user.username);
        }

        await interaction.reply({
            content:`Selected:${selections}`,
            ephemeral:true
        })
    }
}