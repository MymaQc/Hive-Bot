const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

/**
 * @type {{name: string, execute(CommandInteraction, Client): Promise<*|void|undefined>}}
 */
module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) {
                return interaction.reply({embeds: [new MessageEmbed()
                            .setColor("RED")
                            .setDescription("❌ Une erreur est survenue lors de l'éxécution de cette commande.")
                    ]}) && client.commands.delete(interaction.commandName);
            }

            if (command.permission && !interaction.member.permissions.has(command.permission)) {
                return interaction.reply({content: `Vous n'avez pas les permissions nécessaires pour effectuer cette commande. \`${interaction.commandName}\`.`, ephemeral: true})
            }

            command.execute(interaction, client)
        }
    }
}