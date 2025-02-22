const { createEmbed } = require('../../utils/embed.js');
const { getGif } = require('../../utils/tenor.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'smug',
    description: '😏 ¡Muestra una sonrisa presumida!',
    aliases: ['presumir', 'presumido'],
    cooldown: 3,
    slashCommand: true,
    options: new SlashCommandBuilder()
        .setName('smug')
        .setDescription('¡Muestra una sonrisa presumida!')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario a quien presumir (opcional)')
                .setRequired(false)
        ),

    async execute(message, args) {
        const target = message.mentions.users.first();
        let description;

        const smugMessages = [
            "sonríe con suficiencia 😏",
            "muestra una sonrisa presumida 💅",
            "hace una mueca de superioridad ✨",
            "presume con estilo 🌟",
            "sonríe con aire de victoria 🏆",
            "muestra su lado presumido 💫",
            "adopta una pose de superioridad 👑",
            "presume sus habilidades ⭐"
        ];

        const targetMessages = [
            "presume ante",
            "mira con suficiencia a",
            "muestra su superioridad a",
            "sonríe presumidamente a",
            "demuestra su confianza ante",
            "hace alarde frente a",
            "exhibe su talento ante",
            "presume sus logros ante"
        ];

        const gifUrl = await getGif('anime smug');

        if (target) {
            const randomTargetMessage = targetMessages[Math.floor(Math.random() * targetMessages.length)];
            description = `**${message.author}** ${randomTargetMessage} **${target}** 😏`;
        } else {
            const randomSmugMessage = smugMessages[Math.floor(Math.random() * smugMessages.length)];
            description = `**${message.author}** ${randomSmugMessage}`;
        }

        const embed = createEmbed(
            '😏 ¡Momento de Presumir!',
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

        const smugMessages = [
            "sonríe con suficiencia 😏",
            "muestra una sonrisa presumida 💅",
            "hace una mueca de superioridad ✨",
            "presume con estilo 🌟",
            "sonríe con aire de victoria 🏆",
            "muestra su lado presumido 💫",
            "adopta una pose de superioridad 👑",
            "presume sus habilidades ⭐"
        ];

        const targetMessages = [
            "presume ante",
            "mira con suficiencia a",
            "muestra su superioridad a",
            "sonríe presumidamente a",
            "demuestra su confianza ante",
            "hace alarde frente a",
            "exhibe su talento ante",
            "presume sus logros ante"
        ];

        const gifUrl = await getGif('anime smug');

        if (target) {
            const randomTargetMessage = targetMessages[Math.floor(Math.random() * targetMessages.length)];
            description = `**${interaction.user}** ${randomTargetMessage} **${target}** 😏`;
        } else {
            const randomSmugMessage = smugMessages[Math.floor(Math.random() * smugMessages.length)];
            description = `**${interaction.user}** ${randomSmugMessage}`;
        }

        const embed = createEmbed(
            '😏 ¡Momento de Presumir!',
            description
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        await interaction.reply({ embeds: [embed] });
    }
};
