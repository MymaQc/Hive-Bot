const { Client, Collection } = require("discord.js");
const client = new Client({intents: 32767});
const { Token } = require("./config.json");

const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);

client.commands = new Collection();

require("./Handlers/Events")(client, PG);
require("./Handlers/Commands")(client, PG);
require("./Handlers/AntiCrash")(client);

client.login(Token).then(() => {
    console.log("[BOT] Client connecté à " + client.user.tag)
}).catch((err) => {
    console.log(err)
})