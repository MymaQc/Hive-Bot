const { Client } = require("discord.js");

/**
 * @type {{once: boolean, name: string, execute(Client): void}}
 */
module.exports = {
    name: "ready",
    once: true,
    /** 
     * @param {Client} client
     */
    execute(client) {
        client.user.setPresence({ activities: [{ type: 'PLAYING', name: "Hive 🐝" }], status: 'online'});
    }
}