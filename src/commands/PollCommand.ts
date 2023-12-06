module.exports = {
    name: "poll",
    description: "create a new poll",
    run: async (interaction ) => {
        interaction.reply({
            ephemeral: true,
            content: "New Poll"
        })
    }
};