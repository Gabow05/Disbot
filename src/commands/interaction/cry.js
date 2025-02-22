const { createEmbed } = require('../../utils/embed.js');
const { getGif } = require('../../utils/tenor.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'cry',
    description: '😢 ¡Expresar tristeza o llanto!',
    aliases: ['llorar', 'sad'],
    cooldown: 3,
    slashCommand: true,
    options: new SlashCommandBuilder()
        .setName('cry')
        .setDescription('¡Expresar tristeza o llanto!')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario que te hizo llorar (opcional)')
                .setRequired(false)
        ),

    async execute(message, args) {
        const target = message.mentions.users.first();
        let description;

        const cryMessages = [
            "llora desconsoladamente 😭",
            "derrama lágrimas de tristeza 😢",
            "solloza en un rincón 🥺",
            "no puede contener las lágrimas 💧",
            "tiene un momento emotivo 😿",
            "llora como una fuente ⛲",
            "deja escapar algunas lágrimas 🌧️",
            "muestra su lado sensible 💔"
        ];

        const randomMessage = cryMessages[Math.floor(Math.random() * cryMessages.length)];
        const gifUrl = await getGif('anime cry');

        if (target) {
            description = `**${message.author}** ${randomMessage} por culpa de **${target}**`;
        } else {
            description = `**${message.author}** ${randomMessage}`;
        }

        const embed = createEmbed(
            '😢 ¡Momento Emotivo!',
            description
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        message.channel.send({ embeds: [embed] });
    },

    async slashExecute(interaction) {
        const target = interaction.options.getUser('usuario');
        let description;

        const cryMessages = [
            "llora desconsoladamente 😭",
            "derrama lágrimas de tristeza 😢",
            "solloza en un rincón 🥺",
            "no puede contener las lágrimas 💧",
            "tiene un momento emotivo 😿",
            "llora como una fuente ⛲",
            "deja escapar algunas lágrimas 🌧️",
            "muestra su lado sensible 💔"
        ];

        const randomMessage = cryMessages[Math.floor(Math.random() * cryMessages.length)];
        const gifUrl = await getGif('anime cry');

        if (target) {
            description = `**${interaction.user}** ${randomMessage} por culpa de **${target}**`;
        } else {
            description = `**${interaction.user}** ${randomMessage}`;
        }

        const embed = createEmbed(
            '😢 ¡Momento Emotivo!',
            description
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        await interaction.reply({ embeds: [embed] });
    }
};
