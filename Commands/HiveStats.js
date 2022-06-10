const { MessageEmbed } = require("discord.js");
const Hive = require("hive-tools-wrapper");
const Image = require("../Constants/Image");

/**
 * @type {{name: string, options: [{name: string, description: string, type: string, choices: [{name: string, value: string}], required: boolean},{name: string, description: string, type: string, required: boolean},{name: string, description: string, type: string, choices: [{name: string, value: string},{name: string, value: string}], required: boolean}], description: string, permission: string, execute(*, *): Promise<void>}}
 */
module.exports = {
    name: "hive-stats",
    description: "Obtenir les statistiques d'un joueur spécifique dans n'importe quel mode de jeu.",
    permission: "VIEW_CHANNEL",
    options: [{
        name: "player",
        description: "Spécifie le nom d'un joueur",
        type: "STRING",
        required: true,
    },{
        name: "game",
        description: "Sélectionne un mode de jeu",
        type: "STRING",
        required: true,
        choices: [
            { name: "Treasure Wars", value: "wars" },
            { name: "Death Run", value: "dr" },
            { name: "Murder Mystery", value: "murder" },
            { name: "Survival Games", value: "sg" },
            { name: "Sky Wars", value: "sky" },
            { name: "Just Build", value: "build" },
            { name: "Capture the Flag", value: "ctf" },
            { name: "Hide & Seek", value: "hide" },
            { name: "Block Drop", value: "drop" },
            { name: "Ground Wars", value: "ground" }
        ]
    },{
        name: "time",
        description: "Spécifie une portée temporelle (Monthly/AllTime)",
        type: "STRING",
        required: true,
        choices: [
            { name: "Mensuel", value: "monthly" },
            { name: "Permanent", value: "all" }
        ]
    },{
        name: "month",
        description: "Spécifie le mois des statistiques à récupérer",
        type: "STRING",
        choices: [
            { name: "Janvier", value: "01" },
            { name: "Février", value: "02" },
            { name: "Mars", value: "03" },
            { name: "Avril", value: "04" },
            { name: "Mai", value: "05" },
            { name: "Juin", value: "06" },
            { name: "Juillet", value: "07" },
            { name: "Août", value: "08" },
            { name: "Septembre", value: "09" },
            { name: "Octobre", value: "10" },
            { name: "Novembre", value: "11" },
            { name: "Décembre", value: "12" }
        ]
    },{
        name: "year",
        description: "Spécifie l'année des statistiques à récupérer",
        type: "STRING",
        choices: [
            { name: "2020", value: "2020" },
            { name: "2021", value: "2021"},
            { name: "2022", value: "2022"}
        ]
    }],
    /**
     * @param interaction
     * @param client
     * @returns {Promise<void>}
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const Player = options.getString("player");
        const Game = options.getString("game");
        let Time = options.getString("time");
        const Year = options.getString("year");
        let Month = options.getString("month");

        let Embed = new MessageEmbed()
            .setColor("GOLD")

        console.log("[HIVE] Commande effectuée -> user:" + Player + " game:" + Game + " time:" + Time + " year:" + Year + " month:" + Month)

        function ConvertMonthToName(Month) {
            switch (Month) {
                case "01": { Month = "Janvier"; break; }
                case "02": { Month = "Février"; break; }
                case "03": { Month = "Mars"; break; }
                case "04": { Month = "Avril"; break; }
                case "05": { Month = "Mai"; break; }
                case "06": { Month = "Juin"; break; }
                case "07": { Month = "Juillet"; break; }
                case "08": { Month = "Août"; break; }
                case "09": { Month = "Septembre"; break; }
                case "10": { Month = "Octobre"; break; }
                case "11": { Month = "Novembre"; break; }
                case "12": { Month = "Décembre"; break; }
            }
            return Month
        }

        switch (Time) {
            case "monthly": {
                Time = "Mensuel"
                if (Year && Month) {
                    await Hive.getMonthlyPlayerStats(Player, Game, Year, Month).then(result => {
                        switch (Game) {
                            case "wars": {
                                Embed
                                    .setTitle("**" + Player + "・Treasure Wars**")
                                    .setURL("https://hivetools.app/search/" + Player)
                                    .setThumbnail(Image.TREASURE_WARS)
                                    .addFields(
                                        { name: "**Classement**", value: `\`${result.human_index}\``, inline: true },
                                        { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                        { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                        { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                        { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                        { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                        { name: "**Kills**", value: `\`${result.kills}\``, inline: true },
                                        { name: "**Final Kills**", value: `\`${result.final_kills}\``, inline: true },
                                        { name: "**Morts**", value: `\`${result.deaths}\``, inline: true },
                                        { name: "**KDR**", value: `\`${result.kdr}\``, inline: true },
                                        { name: "**FKDR**", value: `\`${result.fkdr}\``, inline: true },
                                        { name: "**Trésors détruits**", value: `\`${result.treasure_destroyed}\``, inline: true }
                                    )
                                    .setFooter({ text: `${Time}・${ConvertMonthToName(Month)} ${Year}`});
                                break;
                            } case "dr": {
                                Embed
                                    .setTitle("**" + Player + "・Death Run**")
                                    .setURL("https://hivetools.app/search/" + Player)
                                    .setThumbnail(Image.DEATH_RUN)
                                    .addFields(
                                        { name: "**Classement**", value: `\`${result.human_index}\``, inline: true },
                                        { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                        { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                        { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                        { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                        { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                        { name: "**Kills**", value: `\`${result.kills}\``, inline: true },
                                        { name: "**Morts**", value: `\`${result.deaths}\``, inline: true },
                                        { name: "**Pièges activés**", value: `\`${result.activated}\``, inline: true },
                                        { name: "**Checkpoints**", value: `\`${result.checkpoints}\``, inline: true }
                                    )
                                    .setFooter({ text: `${Time}・${ConvertMonthToName(Month)} ${Year}`});
                                break;
                            } case "murder": {
                                Embed
                                    .setTitle("**" + Player + "・Murder Mystery**")
                                    .setURL("https://hivetools.app/search/" + Player)
                                    .setThumbnail(Image.MURDER_MYSTERY)
                                    .addFields(
                                        { name: "**Classement**", value: `\`${result.human_index}\``, inline: true },
                                        { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                        { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                        { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                        { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                        { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                        { name: "**Kills**", value: `\`${result.kills}\``, inline: true },
                                        { name: "**Kills en murder**", value: `\`${result.murders}\``, inline: true },
                                        { name: "**Kills du murder**", value: `\`${result.murderer_eliminations}\``, inline: true },
                                        { name: "**Morts**", value: `\`${result.deaths}\``, inline: true },
                                        { name: "**Pièces récoltées**", value: `\`${result.coins}\``, inline: true }
                                    )
                                    .setFooter({ text: `${Time}・${ConvertMonthToName(Month)} ${Year}`});
                                break;
                            } case "sg": {
                                Embed
                                    .setTitle("**" + Player + "・Survival Games**")
                                    .setURL("https://hivetools.app/search/" + Player)
                                    .setThumbnail(Image.SURVIVAL_GAMES)
                                    .addFields(
                                        { name: "**Classement**", value: `\`${result.human_index}\``, inline: true },
                                        { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                        { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                        { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                        { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                        { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                        { name: "**Kills**", value: `\`${result.kills}\``, inline: true },
                                        { name: "**Coffres ouverts**", value: `\`${result.crates}\``, inline: true },
                                        { name: "**Deathmatches**", value: `\`${result.deathmatches}\``, inline: true },
                                        { name: "**Cows**", value: `\`${result.cows}\``, inline: true }
                                    )
                                    .setFooter({ text: `${Time}・${ConvertMonthToName(Month)} ${Year}`});
                                break;
                            } case "sky": {
                                Embed
                                    .setTitle("**" + Player + "・Sky Wars**")
                                    .setURL("https://hivetools.app/search/" + Player)
                                    .setThumbnail(Image.SKY_WARS)
                                    .addFields(
                                        { name: "**Classement**", value: `\`${result.human_index}\``, inline: true },
                                        { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                        { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                        { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                        { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                        { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                        { name: "**Kills**", value: `\`${result.kills}\``, inline: true },
                                        { name: "**Coffres mystères détruits**", value: `\`${result.mystery_chests_destroyed}\``, inline: true },
                                        { name: "**Minerais minés**", value: `\`${result.ores_mined}\``, inline: true },
                                        { name: "**Sorts lancés**", value: `\`${result.spells_used}\``, inline: true }
                                    )
                                    .setFooter({ text: `${Time}・${ConvertMonthToName(Month)} ${Year}`});
                                break;
                            } case "ctf": {
                                Embed
                                    .setTitle("**" + Player + "・Capture the Flag**")
                                    .setURL("https://hivetools.app/search/" + Player)
                                    .setThumbnail(Image.CAPTURE_THE_FLAG)
                                    .addFields(
                                        { name: "**Classement**", value: `\`${result.human_index}\``, inline: true },
                                        { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                        { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                        { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                        { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                        { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                        { name: "**Kills**", value: `\`${result.kills}\``, inline: true },
                                        { name: "**Morts**", value: `\`${result.deaths}\``, inline: true },
                                        { name: "**Assistances**", value: `\`${result.assists}\``, inline: true },
                                        { name: "**Flags capturés**", value: `\`${result.flags_captured}\``, inline: true },
                                        { name: "**Flags retournés**", value: `\`${result.flags_returned}\``, inline: true }
                                    )
                                    .setFooter({ text: `${Time}・${ConvertMonthToName(Month)} ${Year}`});
                                break;
                            }
                    }})
                } else if (Year && !Month || !Year && Month) {
                    Embed
                        .setColor("RED")
                        .setDescription("Les options `year` et `month` dépendent l'un de l'autre. Par conséquent, vous ne pouvez pas utiliser l'un sans l'autre.");
                } else {
                    await Hive.getMonthlyPlayerStats(Player, Game).then(result => {
                        switch (Game) {
                            case "wars": {
                                Embed
                                    .setTitle("**" + Player + "・Treasure Wars**")
                                    .setURL("https://hivetools.app/search/" + Player)
                                    .setThumbnail(Image.TREASURE_WARS)
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
                                break;
                            } case "dr": {
                                Embed
                                    .setTitle("**" + Player + "・Death Run**")
                                    .setURL("https://hivetools.app/search/" + Player)
                                    .setThumbnail(Image.DEATH_RUN)
                                    .setDescription("**__Période :__** " + Time + "\n\n" +
                                        "**Classement :** " + result.human_index + "\n" +
                                        "**EXP sans boost :** " + result.uncapped_xp + "\n" +
                                        "**EXP :** " + result.xp + "\n" +
                                        "**Parties jouées :** " + result.played + "\n" +
                                        "**Parties gagnées :** " + result.victories + "\n" +
                                        "**Parties perdues :** " + result.games_lost + "\n" +
                                        "**Kills :** " + result.kills + "\n" +
                                        "**Morts :** " + result.deaths + "\n" +
                                        "**Checkpoints :** " + result.checkpoints
                                    );
                                break;
                            } case "murder": {
                                Embed
                                    .setTitle("**" + Player + "・Murder Mystery**")
                                    .setURL("https://hivetools.app/search/" + Player)
                                    .setThumbnail(Image.MURDER_MYSTERY)
                                    .setDescription("**__Période :__** " + Time + "\n\n" +
                                        "**Classement :** " + result.human_index + "\n" +
                                        "**EXP sans boost :** " + result.uncapped_xp + "\n" +
                                        "**EXP :** " + result.xp + "\n" +
                                        "**Parties jouées :** " + result.played + "\n" +
                                        "**Parties gagnées :** " + result.victories + "\n" +
                                        "**Parties perdues :** " + result.games_lost + "\n" +
                                        "**Assassins :** " + result.murders + "\n" +
                                        "**Kills en assassin :** " + result.murderer_eliminations + "\n" +
                                        "**Pièces amassées :** " + result.coins
                                    );
                                break;
                            } case "sg": {
                                Embed
                                    .setTitle("**" + Player + "・Survival Games**")
                                    .setURL("https://hivetools.app/search/" + Player)
                                    .setThumbnail(Image.SURVIVAL_GAMES)
                                    .setDescription("**__Période :__** " + Time + "\n\n" +
                                        "**Classement :** " + result.human_index + "\n" +
                                        "**EXP sans boost :** " + result.uncapped_xp + "\n" +
                                        "**EXP :** " + result.xp + "\n" +
                                        "**Parties jouées :** " + result.played + "\n" +
                                        "**Parties gagnées :** " + result.victories + "\n" +
                                        "**Parties perdues :** " + result.games_lost + "\n" +
                                        "**Winrate :** " + result.win_percentage + "\n" +
                                        "**Kills :** " + result.kills + "\n" +
                                        "**Coffres ouverts :** " + result.crates + "\n" +
                                        "**Deathmatches :** " + result.deathmatches + "\n" +
                                        "**Cows :** " + result.cows
                                    );
                                break;
                            } case "sky": {
                                Embed
                                    .setTitle("**" + Player + "・Sky Wars**")
                                    .setURL("https://hivetools.app/search/" + Player)
                                    .setThumbnail(Image.SKY_WARS)
                                    .setDescription("**__Période :__** " + Time + "\n\n" +
                                        "**Classement :** " + result.human_index + "\n" +
                                        "**EXP sans boost :** " + result.uncapped_xp + "\n" +
                                        "**EXP :** " + result.xp + "\n" +
                                        "**Parties jouées :** " + result.played + "\n" +
                                        "**Parties gagnées :** " + result.victories + "\n" +
                                        "**Parties perdues :** " + result.games_lost + "\n" +
                                        "**Winrate :** " + result.win_percentage + "\n" +
                                        "**Kills :** " + result.kills + "\n" +
                                        "**Coffres mystères détruits :** " + result.mystery_chests_destroyed + "\n" +
                                        "**Minerais minés :** " + result.ores_mined + "\n" +
                                        "**Sorts utilités :** " + result.spells_used
                                    );
                                break;
                            } case "ctf": {
                                Embed
                                    .setTitle("**" + Player + "・Capture the Flag**")
                                    .setURL("https://hivetools.app/search/" + Player)
                                    .setDescription("**__Période :__** " + Time + "\n\n" +
                                        "**Classement :** " + result.human_index + "\n" +
                                        "**EXP :** " + result.xp + "\n" +
                                        "**Parties jouées :** " + result.played + "\n" +
                                        "**Parties gagnées :** " + result.victories + "\n" +
                                        "**Parties perdues :** " + result.games_lost + "\n" +
                                        "**Winrate :** " + result.win_percentage + "\n" +
                                        "**Kills :** " + result.kills + "\n" +
                                        "**Morts :** " + result.deaths + "\n" +
                                        "**Assistances :** " + result.assists + "\n" +
                                        "**Flags capturés :** " + result.flags_captured + "\n" +
                                        "**Flags retournés :** " + result.flags_returned
                                    );
                                break;
                            }
                        }
                    })
                }
                break;
            }

            case "all": {
                Time = "All-Time"
                await Hive.getAllTimePlayerStats(Player, Game).then(result => {
                    switch (Game) {
                        case "wars": {
                            Embed
                                .setTitle("**" + Player + "・Treasure Wars**")
                                .setURL("https://hivetools.app/search/" + Player)
                                .setThumbnail("https://cdn.discordapp.com/attachments/868676441087299635/979227497210216529/TreasureWars.png")
                                .setDescription("**__Période :__** " + Time + "\n\n" +
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
                            break;
                        }
                        case "dr": {
                            Embed
                                .setTitle("**" + Player + "・Death Run**")
                                .setURL("https://hivetools.app/search/" + Player)
                                .setThumbnail("https://cdn.discordapp.com/attachments/868676441087299635/979227497449275452/DeathRun.png")
                                .setDescription("**__Période :__** " + Time + "\n\n" +
                                    "**EXP sans boost :** " + result.uncapped_xp + "\n" +
                                    "**EXP :** " + result.xp + "\n" +
                                    "**Parties jouées :** " + result.played + "\n" +
                                    "**Parties gagnées :** " + result.victories + "\n" +
                                    "**Parties perdues :** " + result.games_lost + "\n" +
                                    "**Kills :** " + result.kills + "\n" +
                                    "**Morts :** " + result.deaths + "\n" +
                                    "**Checkpoints :** " + result.checkpoints
                                );
                            break;
                        }
                        case "murder": {
                            Embed
                                .setTitle("**" + Player + "・Murder Mystery**")
                                .setURL("https://hivetools.app/search/" + Player)
                                .setThumbnail("https://cdn.discordapp.com/attachments/868676441087299635/979227496614604811/MurderMystery.png")
                                .setDescription("**__Période :__** " + Time + "\n\n" +
                                    "**EXP sans boost :** " + result.uncapped_xp + "\n" +
                                    "**EXP :** " + result.xp + "\n" +
                                    "**Parties jouées :** " + result.played + "\n" +
                                    "**Parties gagnées :** " + result.victories + "\n" +
                                    "**Parties perdues :** " + result.games_lost + "\n" +
                                    "**Assassins :** " + result.murders + "\n" +
                                    "**Kills en assassin :** " + result.murderer_eliminations + "\n" +
                                    "**Pièces amassées :** " + result.coins
                                );
                            break;
                        }
                        case "sg": {
                            Embed
                                .setTitle("**" + Player + "・Survival Games**")
                                .setURL("https://hivetools.app/search/" + Player)
                                .setThumbnail("https://cdn.discordapp.com/attachments/868676441087299635/979227497000488980/SurvivalGames.png")
                                .setDescription("**__Période :__** " + Time + "\n\n" +
                                    "**EXP sans boost :** " + result.uncapped_xp + "\n" +
                                    "**EXP :** " + result.xp + "\n" +
                                    "**Parties jouées :** " + result.played + "\n" +
                                    "**Parties gagnées :** " + result.victories + "\n" +
                                    "**Parties perdues :** " + result.games_lost + "\n" +
                                    "**Winrate :** " + result.win_percentage + "\n" +
                                    "**Kills :** " + result.kills + "\n" +
                                    "**Coffres ouverts :** " + result.crates + "\n" +
                                    "**Deathmatches :** " + result.deathmatches + "\n" +
                                    "**Cows :** " + result.cows
                                );
                            break;
                        }
                        case "sky": {
                            Embed
                                .setTitle("**" + Player + "・Sky Wars**")
                                .setURL("https://hivetools.app/search/" + Player)
                                .setThumbnail("https://cdn.discordapp.com/attachments/868676441087299635/979569526322659389/SkyWars.png")
                                .setDescription("**__Période :__** " + Time + "\n\n" +
                                    "**EXP sans boost :** " + result.uncapped_xp + "\n" +
                                    "**EXP :** " + result.xp + "\n" +
                                    "**Parties jouées :** " + result.played + "\n" +
                                    "**Parties gagnées :** " + result.victories + "\n" +
                                    "**Parties perdues :** " + result.games_lost + "\n" +
                                    "**Winrate :** " + result.win_percentage + "\n" +
                                    "**Kills :** " + result.kills + "\n" +
                                    "**Coffres mystères détruits :** " + result.mystery_chests_destroyed + "\n" +
                                    "**Minerais minés :** " + result.ores_mined + "\n" +
                                    "**Sorts utilités :** " + result.spells_used
                                );
                            break;
                        }
                        case "ctf": {
                            Embed
                                .setTitle("**" + Player + "・Capture the Flag**")
                                .setURL("https://hivetools.app/search/" + Player)
                                .setDescription("**__Période :__** " + Time + "\n\n" +
                                    "**EXP :** " + result.xp + "\n" +
                                    "**Parties jouées :** " + result.played + "\n" +
                                    "**Parties gagnées :** " + result.victories + "\n" +
                                    "**Kills :** " + result.kills + "\n" +
                                    "**Morts :** " + result.deaths + "\n" +
                                    "**Assistances :** " + result.assists + "\n" +
                                    "**Flags capturés :** " + result.flags_captured + "\n" +
                                    "**Flags retournés :** " + result.flags_returned
                                );
                            break;
                        }
                    }
                })
            }
        }
    
        interaction.reply({embeds: [Embed]});
    }
}