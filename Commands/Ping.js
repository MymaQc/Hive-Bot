const { CommandInteraction, MessageEmbed } = require("discord.js");

/**
 * @type {{name: string, description: string, permission: string, execute(CommandInteraction): void}}
 */
module.exports = {
    name: "ping",
    description: "Ping",
    permission: "ADMINISTRATOR",
    /**
     * @param {CommandInteraction} interaction
     */
    execute(interaction) {
        interaction.reply({embeds: [new MessageEmbed()
            .setColor("GOLD")
            .setDescription("Pong 🏓")
        ], ephemeral: true});
    }
}