const { MessageEmbed } = require("discord.js");
const Hive = require("hive-tools-wrapper");

/**
 * @type {{name: string, options: [{name: string, description: string, type: string, choices: [{name: string, value: string}], required: boolean},{name: string, description: string, type: string, required: boolean},{name: string, description: string, type: string, choices: [{name: string, value: string},{name: string, value: string}], required: boolean}], description: string, permission: string, execute(*, *): Promise<void>}}
 */
module.exports = {
    name: "hive-stats",
    description: "Obtenir les statistiques d'un joueur spécifique dans n'importe quel mode de jeu.",
    permission: "ADMINISTRATOR",
    options: [{
        name: "game",
        description: "Sélectionne un mode de jeu",
        type: "STRING",
        required: true,
        choices: [
            { name: "Treasure Wars", value: "wars" },
            { name: "Death Run", value: "dr" },
            { name: "Hide & Seek", value: "hide" },
            { name: "Murder Mystery", value: "murder" },
            { name: "Survival Games", value: "sg" },
            { name: "Sky Wars", value: "sky" },
            { name: "Just Build", value: "build" }
        ]
    },{
        name: "player",
        description: "Spécifie le nom d'un joueur",
        type: "STRING",
        required: true,
    },{
        name: "time",
        description: "Spécifie une portée temporelle (Monthly/AllTime)",
        type: "STRING",
        required: true,
        choices: [
            { name: "Monthly", value: "monthly" },
            { name: "All Time", value: "all" }
        ]
    },{
        name: "year",
        description: "Spécifie l'année des statistiques à récupérer",
        type: "STRING"
    },{
        name: "month",
        description: "Spécifie le mois des statistiques à récupérer",
        type: "STRING",
        choices: [
            { name: "Janvier", value: "1" },
            { name: "Février", value: "2" },
            { name: "Mars", value: "3" },
            { name: "Avril", value: "4" },
            { name: "Mai", value: "5" },
            { name: "Juin", value: "6" },
            { name: "Juillet", value: "7" },
            { name: "Août", value: "8" },
            { name: "Septembre", value: "9" },
            { name: "Octobre", value: "10" },
            { name: "Novembre", value: "11" },
            { name: "Décembre", value: "12" }
        ]
    }],
    /**
     * @param interaction
     * @param client
     * @returns {Promise<void>}
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const Game = options.getString("game");
        const Player = options.getString("player");
        let Time = options.getString("time");
        const Year = options.getString("year");
        const Month = options.getString("month");

        const Embed = new MessageEmbed()
            .setColor("GOLD");

        switch (Time) {
            case "monthly": {
                Time = "Monthly"
                if (Year && Month) {
                    await Hive.getMonthlyPlayerStats(Player, Game, Year, Month).then(result => {
                        switch (Game) {
                            case "wars": {
                                Embed
                                    .setTitle("**" + Player + "・Treasure Wars**")
                                    .setURL("https://hivetools.app/search/" + Player)
                                    .setThumbnail("https://cdn.discordapp.com/attachments/868676441087299635/979227497210216529/TreasureWars.png")
                                    .setDescription("**__Période :__** " + Time + "\n\n" +
                                        "**Classement :** " + result.human_index + "\n" +
                                        "**EXP sans boost :** " + result.uncapped_xp + "\n" +
                                        "**EXP :** " + result.xp + "\n" +
                                        "**Parties jouées :** " + result.played + "\n" +
                                        "**Parties gagnées :** " + result.victories + "\n" +
                                        "**Parties perdues :** " + result.games_lost + "\n" +
                                        "**Winrate :** " + result.win_percentage + "\n" +
                                        "**Kills :** " + result.kills + "\n" +
                                        "**Morts :** " + result.deaths + "\n" +
                                        "**Final Kills :** " + result.final_kills + "\n" +
                                        "**KDR :** " + result.kdr + "\n" +
                                        "**FKDR :** " + result.fkdr + "\n" +
                                        "**Trésors détruits :** " + result.treasure_destroyed
                                    );
                            }
                        }
                    })
                } else if (Year && !Month) {
                    Embed.setColor("RED").setDescription("Spécifie un mois mon tabarnak");
                } else if (!Year && Month) {
                    Embed.setColor("RED").setDescription("Spécifie une année mon tabarnak");
                } else {
                    await Hive.getMonthlyPlayerStats(Player, Game).then(result => {
                        switch (Game) {
                            case "wars": {
                                Embed
                                    .setTitle("**" + Player + "・Treasure Wars**")
                                    .setURL("https://hivetools.app/search/" + Player)
                                    .setThumbnail("https://cdn.discordapp.com/attachments/868676441087299635/979227497210216529/TreasureWars.png")
                                    .setDescription("**__Période :__** " + Time + "\n\n" +
                                        "**Classement :** " + result.human_index + "\n" +
                                        "**EXP sans boost :** " + result.uncapped_xp + "\n" +
                                        "**EXP :** " + result.xp + "\n" +
                                        "**Parties jouées :** " + result.played + "\n" +
                                        "**Parties gagnées :** " + result.victories + "\n" +
                                        "**Parties perdues :** " + result.games_lost + "\n" +
                                        "**Winrate :** " + result.win_percentage + "\n" +
                                        "**Kills :** " + result.kills + "\n" +
                                        "**Morts :** " + result.deaths + "\n" +
                                        "**Final Kills :** " + result.final_kills + "\n" +
                                        "**KDR :** " + result.kdr + "\n" +
                                        "**FKDR :** " + result.fkdr + "\n" +
                                        "**Trésors détruits :** " + result.treasure_destroyed
                                    );
                            }
                        }
                    })
                }
            }

            case "all": {
                Time = "All-Time"
                await Hive.getAllTimePlayerStats(Player, Game);
            }
        }

        interaction.reply({embeds: [Embed]})
    }
}