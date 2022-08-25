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
     */
    async execute(interaction) {
        const { options } = interaction;

        let Player = options.getString("player");
        const Game = options.getString("game");
        let Time = options.getString("time");
        const Year = options.getString("year");
        let Month = options.getString("month");

        let Embed = new MessageEmbed()
            .setColor("GOLD")

        let errorEmbed = new MessageEmbed()
            .setColor("RED")

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

        if (Time === "all" && Month && Year) {
            errorEmbed
                .setDescription("Les options `year` et `month` ne sont pas utilisables lorsque le timescope `Permanent` est sélectionné.");
            return interaction.reply({ embeds: [errorEmbed] });
        }

        if (Time === "all" && Year) {
            errorEmbed
                .setDescription("L'option `year` n'est pas utilisable lorsque le timescope `Permanent` est sélectionné.");
            return interaction.reply({ embeds: [errorEmbed] });
        } else if (Time === "all" && Month) {
            errorEmbed
                .setDescription("L'option `month` n'est pas utilisable lorsque le timescope `Permanent` est sélectionné.");
            return interaction.reply({ embeds: [errorEmbed] });
        }

        if (Year && !Month || !Year && Month) {
            errorEmbed
                .setDescription("Les options `year` et `month` dépendent l'un de l'autre. Par conséquent, vous ne pouvez pas utiliser l'un sans l'autre.");
            return interaction.reply({ embeds: [errorEmbed] });
        }

        switch (Time) {
            case "monthly": {
                Time = "Mensuel"
                if (Year && Month) {
                    await Hive.getMonthlyPlayerStats(Player, Game, Year, Month).then(result => {
                        switch (Game) {
                            case "wars": {
                                Embed
                                    .setTitle("**" + Player.replace("%20", " ") + "・Treasure Wars**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
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
                                    .setTitle("**" + Player.replace("%20", " ") + "・Death Run**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
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
                                    .setTitle("**" + Player.replace("%20", " ") + "・Murder Mystery**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
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
                                    .setTitle("**" + Player.replace("%20", " ") + "・Survival Games**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
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
                                    .setTitle("**" + Player.replace("%20", " ") + "・Sky Wars**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
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
                                    .setTitle("**" + Player.replace("%20", " ") + "・Capture the Flag**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
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
                            } case "drop": {
                                Embed
                                    .setTitle("**" + Player.replace("%20", " ") + "・Block Drop**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                    .setThumbnail(Image.BLOCK_DROP)
                                    .addFields(
                                        { name: "**Classement**", value: `\`${result.human_index}\``, inline: true },
                                        { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                        { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                        { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                        { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                        { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                        { name: "**Morts**", value: `\`${result.deaths}\``, inline: true },
                                        { name: "**Blocs détruits**", value: `\`${result.blocks_destroyed}\``, inline: true },
                                        { name: "**Pouvoir récoltés**", value: `\`${result.powerups_collected}\``, inline: true },
                                        { name: "**Plumes utilitsées**", value: `\`${result.vaults_used}\``, inline: true }
                                    )
                                    .setFooter({ text: `${Time}・${ConvertMonthToName(Month)} ${Year}`});
                                break;
                            } case "ground": {
                                Embed
                                    .setTitle("**" + Player.replace("%20", " ") + "・Ground Wars**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                    .setThumbnail(Image.GROUND_WARS)
                                    .addFields(
                                        { name: "**Classement**", value: `\`${result.human_index}\``, inline: true },
                                        { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                        { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                        { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                        { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                        { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                        { name: "**Morts**", value: `\`${result.deaths}\``, inline: true },
                                        { name: "**Blocs détruits**", value: `\`${result.blocks_destroyed}\``, inline: true },
                                        { name: "**Blocs posés**", value: `\`${result.blocks_placed}\``, inline: true },
                                        { name: "**Projectiles tirés**", value: `\`${result.projectiles_fired}\``, inline: true }
                                    )
                                    .setFooter({ text: `${Time}・${ConvertMonthToName(Month)} ${Year}`});
                                break;
                            } case "hide": {
                                Embed
                                    .setTitle("**" + Player.replace("%20", " ") + "・Hide & Seek**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                    .setThumbnail(Image.HIDE_AND_SEEK)
                                    .addFields(
                                        { name: "**Classement**", value: `\`${result.human_index}\``, inline: true },
                                        { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                        { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                        { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                        { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                        { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                        { name: "**Morts**", value: `\`${result.deaths}\``, inline: true },
                                        { name: "**Kills (cacheur)**", value: `\`${result.hider_kills}\``, inline: true },
                                        { name: "**Kills (chercheur)**", value: `\`${result.seeker_kills}\``, inline: true }
                                    )
                                    .setFooter({ text: `${Time}・${ConvertMonthToName(Month)} ${Year}`});
                                break;
                            } case "build": {
                                Embed
                                    .setTitle("**" + Player.replace("%20", " ") + "・Just Build**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                    .setThumbnail(Image.JUST_BUILD)
                                    .addFields(
                                        { name: "**Classement**", value: `\`${result.human_index}\``, inline: true },
                                        { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                        { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                        { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                        { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                        { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                        { name: "**Notés Meh**", value: `\`${result.rating_meh_received}\``, inline: true },
                                        { name: "**Notés Okay**", value: `\`${result.rating_okay_received}\``, inline: true },
                                        { name: "**Notés Good**", value: `\`${result.rating_good_received}\``, inline: true },
                                        { name: "**Notés Love**", value: `\`${result.rating_love_received}\``, inline: true }
                                    )
                                    .setFooter({ text: `${Time}・${ConvertMonthToName(Month)} ${Year}`});
                                break;
                            }
                    }})
                } else {
                    await Hive.getMonthlyPlayerStats(Player, Game).then(result => {
                        switch (Game) {
                            case "wars": {
                                Embed
                                    .setTitle("**" + Player.replace("%20", " ") + "・Treasure Wars**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
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
                                    .setFooter({ text: `${Time}・Actuel`});
                                break;
                            } case "dr": {
                                Embed
                                    .setTitle("**" + Player.replace("%20", " ") + "・Death Run**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
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
                                    .setFooter({ text: `${Time}・Actuel`});
                                break;
                            } case "murder": {
                                Embed
                                    .setTitle("**" + Player.replace("%20", " ") + "・Murder Mystery**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
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
                                    .setFooter({ text: `${Time}・Actuel`});
                                break;
                            } case "sg": {
                                Embed
                                    .setTitle("**" + Player.replace("%20", " ") + "・Survival Games**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
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
                                    .setFooter({ text: `${Time}・Actuel`});
                                break;
                            } case "sky": {
                                Embed
                                    .setTitle("**" + Player.replace("%20", " ") + "・Sky Wars**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
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
                                    .setFooter({ text: `${Time}・Actuel`});
                                break;
                            } case "ctf": {
                                Embed
                                    .setTitle("**" + Player.replace("%20", " ") + "・Capture the Flag**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
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
                                    .setFooter({ text: `${Time}・Actuel`});
                                break;
                            } case "drop": {
                                Embed
                                    .setTitle("**" + Player.replace("%20", " ") + "・Block Drop**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                    .setThumbnail(Image.BLOCK_DROP)
                                    .addFields(
                                        { name: "**Classement**", value: `\`${result.human_index}\``, inline: true },
                                        { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                        { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                        { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                        { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                        { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                        { name: "**Morts**", value: `\`${result.deaths}\``, inline: true },
                                        { name: "**Blocs détruits**", value: `\`${result.blocks_destroyed}\``, inline: true },
                                        { name: "**Pouvoir récoltés**", value: `\`${result.powerups_collected}\``, inline: true },
                                        { name: "**Plumes utilitsées**", value: `\`${result.vaults_used}\``, inline: true }
                                    )
                                    .setFooter({ text: `${Time}・Actuel`});
                                break;
                            } case "ground": {
                                Embed
                                    .setTitle("**" + Player.replace("%20", " ") + "・Ground Wars**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                    .setThumbnail(Image.GROUND_WARS)
                                    .addFields(
                                        { name: "**Classement**", value: `\`${result.human_index}\``, inline: true },
                                        { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                        { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                        { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                        { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                        { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                        { name: "**Morts**", value: `\`${result.deaths}\``, inline: true },
                                        { name: "**Blocs détruits**", value: `\`${result.blocks_destroyed}\``, inline: true },
                                        { name: "**Blocs posés**", value: `\`${result.blocks_placed}\``, inline: true },
                                        { name: "**Projectiles tirés**", value: `\`${result.projectiles_fired}\``, inline: true }
                                    )
                                    .setFooter({ text: `${Time}・Actuel`});
                                break;
                            } case "hide": {
                                Embed
                                    .setTitle("**" + Player.replace("%20", " ") + "・Hide & Seek**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                    .setThumbnail(Image.HIDE_AND_SEEK)
                                    .addFields(
                                        { name: "**Classement**", value: `\`${result.human_index}\``, inline: true },
                                        { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                        { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                        { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                        { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                        { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                        { name: "**Morts**", value: `\`${result.deaths}\``, inline: true },
                                        { name: "**Kills (cacheur)**", value: `\`${result.hider_kills}\``, inline: true },
                                        { name: "**Kills (chercheur)**", value: `\`${result.seeker_kills}\``, inline: true }
                                    )
                                    .setFooter({ text: `${Time}・Actuel`});
                                break;
                            } case "build": {
                                Embed
                                    .setTitle("**" + Player.replace("%20", " ") + "・Just Build**")
                                    .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                    .setThumbnail(Image.JUST_BUILD)
                                    .addFields(
                                        { name: "**Classement**", value: `\`${result.human_index}\``, inline: true },
                                        { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                        { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                        { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                        { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                        { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                        { name: "**Notés Meh**", value: `\`${result.rating_meh_received}\``, inline: true },
                                        { name: "**Notés Okay**", value: `\`${result.rating_okay_received}\``, inline: true },
                                        { name: "**Notés Good**", value: `\`${result.rating_good_received}\``, inline: true },
                                        { name: "**Notés Love**", value: `\`${result.rating_love_received}\``, inline: true }
                                    )
                                    .setFooter({ text: `${Time}・Actuel`});
                                break;
                            }
                        }
                    })
                }
                break;
            }

            case "all": {
                Time = "Permanent"
                await Hive.getAllTimePlayerStats(Player, Game).then(result => {
                    switch (Game) {
                        case "wars": {
                            Embed
                                .setTitle("**" + Player.replace("%20", " ") + "・Treasure Wars**")
                                .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                .setThumbnail(Image.TREASURE_WARS)
                                .addFields(
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
                                .setFooter({ text: `${Time}`});
                            break;
                        } case "dr": {
                            Embed
                                .setTitle("**" + Player.replace("%20", " ") + "・Death Run**")
                                .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                .setThumbnail(Image.DEATH_RUN)
                                .addFields(
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
                                .setFooter({ text: `${Time}`});
                            break;
                        } case "murder": {
                            Embed
                                .setTitle("**" + Player.replace("%20", " ") + "・Murder Mystery**")
                                .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                .setThumbnail(Image.MURDER_MYSTERY)
                                .addFields(
                                    { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                    { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                    { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                    { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                    { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                    { name: "**Kills en murder**", value: `\`${result.murders}\``, inline: true },
                                    { name: "**Kills du murder**", value: `\`${result.murderer_eliminations}\``, inline: true },
                                    { name: "**Morts**", value: `\`${result.deaths}\``, inline: true },
                                    { name: "**Pièces récoltées**", value: `\`${result.coins}\``, inline: true }
                                )
                                .setFooter({ text: `${Time}`});
                            break;
                        } case "sg": {
                            Embed
                                .setTitle("**" + Player.replace("%20", " ") + "・Survival Games**")
                                .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                .setThumbnail(Image.SURVIVAL_GAMES)
                                .addFields(
                                    { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                    { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                    { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                    { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                    { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                    { name: "**Kills**", value: `\`${result.kills}\``, inline: true },
                                    { name: "**Coffres**", value: `\`${result.crates}\``, inline: true },
                                    { name: "**Deathmatches**", value: `\`${result.deathmatches}\``, inline: true },
                                    { name: "**Cows**", value: `\`${result.cows}\``, inline: true }
                                )
                                .setFooter({ text: `${Time}`});
                            break;
                        } case "sky": {
                            Embed
                                .setTitle("**" + Player.replace("%20", " ") + "・Sky Wars**")
                                .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                .setThumbnail(Image.SKY_WARS)
                                .addFields(
                                    { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                    { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                    { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                    { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                    { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                    { name: "**Kills**", value: `\`${result.kills}\``, inline: true },
                                    { name: "**Coffres mystères**", value: `\`${result.mystery_chests_destroyed}\``, inline: true },
                                    { name: "**Minerais**", value: `\`${result.ores_mined}\``, inline: true },
                                    { name: "**Sorts**", value: `\`${result.spells_used}\``, inline: true }
                                )
                                .setFooter({ text: `${Time}`});
                            break;
                        } case "ctf": {
                            Embed
                                .setTitle("**" + Player.replace("%20", " ") + "・Capture the Flag**")
                                .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                .setThumbnail(Image.CAPTURE_THE_FLAG)
                                .addFields(
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
                                .setFooter({ text: `${Time}`});
                            break;
                        } case "drop": {
                            Embed
                                .setTitle("**" + Player.replace("%20", " ") + "・Block Drop**")
                                .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                .setThumbnail(Image.BLOCK_DROP)
                                .addFields(
                                    { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                    { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                    { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                    { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                    { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                    { name: "**Morts**", value: `\`${result.deaths}\``, inline: true },
                                    { name: "**Blocs**", value: `\`${result.blocks_destroyed}\``, inline: true },
                                    { name: "**Pouvoirs**", value: `\`${result.powerups_collected}\``, inline: true },
                                    { name: "**Plumes**", value: `\`${result.vaults_used}\``, inline: true }
                                )
                                .setFooter({ text: `${Time}`});
                            break;
                        } case "ground": {
                            Embed
                                .setTitle("**" + Player.replace("%20", " ") + "・Ground Wars**")
                                .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                .setThumbnail(Image.GROUND_WARS)
                                .addFields(
                                    { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                    { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                    { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                    { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                    { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                    { name: "**Morts**", value: `\`${result.deaths}\``, inline: true },
                                    { name: "**Blocs détruits**", value: `\`${result.blocks_destroyed}\``, inline: true },
                                    { name: "**Blocs posés**", value: `\`${result.blocks_placed}\``, inline: true },
                                    { name: "**Projectiles**", value: `\`${result.projectiles_fired}\``, inline: true }
                                )
                                .setFooter({ text: `${Time}`});
                            break;
                        } case "hide": {
                            Embed
                                .setTitle("**" + Player.replace("%20", " ") + "・Hide & Seek**")
                                .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                .setThumbnail(Image.HIDE_AND_SEEK)
                                .addFields(
                                    { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                    { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                    { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                    { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                    { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                    { name: "**Morts**", value: `\`${result.deaths}\``, inline: true },
                                    { name: "**Kills (cacheur)**", value: `\`${result.hider_kills}\``, inline: true },
                                    { name: "**Kills (chercheur)**", value: `\`${result.seeker_kills}\``, inline: true }
                                )
                                .setFooter({ text: `${Time}`});
                            break;
                        } case "build": {
                            Embed
                                .setTitle("**" + Player.replace("%20", " ") + "・Just Build**")
                                .setURL("https://hivetools.app/search/" + Player.replace(" ", "%20"))
                                .setThumbnail(Image.JUST_BUILD)
                                .addFields(
                                    { name: "**EXP**", value: `\`${result.xp}\``, inline: true },
                                    { name: "**Parties**", value: `\`${result.played}\``, inline: true },
                                    { name: "**Victoires**", value: `\`${result.victories}\``, inline: true },
                                    { name: "**Défaites**", value: `\`${result.games_lost}\``, inline: true },
                                    { name: "**Winrate**", value: `\`${result.win_percentage}\``, inline: true },
                                    { name: "**Notés Meh**", value: `\`${result.rating_meh_received}\``, inline: true },
                                    { name: "**Notés Okay**", value: `\`${result.rating_okay_received}\``, inline: true },
                                    { name: "**Notés Good**", value: `\`${result.rating_good_received}\``, inline: true },
                                    { name: "**Notés Love**", value: `\`${result.rating_love_received}\``, inline: true }
                                )
                                .setFooter({ text: `${Time}`});
                            break;
                        }
                    }
                })
            }
        }

        interaction.reply({embeds: [Embed]});
    }
}