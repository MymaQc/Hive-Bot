const { Client } = require("discord.js");
const { Perms } = require("../Validation/Permissions");
let CommandsArray = [];

/**
 * @param {Client} client
 * @param PG
 */
module.exports = async (client, PG) => {
    (await PG(`${process.cwd()}/Commands/*.js`)).map(async (file) => {
        const command = require(file);

        if (!command.name) {
            return console.error("[COMMANDE] " + file.split("/")[7] + " -> Nom manquant ou introuvable")
        }

        if (!command.context && !command.description) {
            return console.error("[COMMANDE] " + command.name + " -> Description manquante ou introuvable")
        }

        if (command.permission) {
            if (Perms.includes(command.permission)) {
                command.defaultPermission = true;
            } else {
                return console.error("[COMMANDE] " + command.name + " -> Permission manquante ou introuvable", 'color: red;')
            }
        }

        client.commands.set(command.name, command);
        CommandsArray.push(command);

        await console.log("[COMMANDE] " + command.name + " -> Chargée")
    });

    client.on("ready", async () => {
        client.guilds.cache.forEach((guild) => {
            guild.commands.set(CommandsArray);
        });
    });
}