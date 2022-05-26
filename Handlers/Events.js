/**
 * @param {Client} client
 * @param PG
 */
module.exports = async (client, PG) => {
    (await PG(`${process.cwd()}/Events/*/*.js`)).map(async (file) => {
        const event = require(file);

        if (!event.name) {
            return console.error("[EVENT] " + event.name + " -> Nom manquant ou introuvable");
        }

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }

        await console.log("[EVENT] " + event.name + " -> Chargée")
    });
}