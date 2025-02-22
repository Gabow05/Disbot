const { createEmbed } = require('../../utils/embed.js');
const { getGif } = require('../../utils/tenor.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'wave',
    description: '👋 ¡Saluda de forma amistosa!',
    aliases: ['saludar', 'hello'],
    cooldown: 3,
    slashCommand: true,
    options: new SlashCommandBuilder()
        .setName('wave')
        .setDescription('¡Saluda de forma amistosa!')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario a quien saludar (opcional)')
                .setRequired(false)
        ),

    async execute(message, args) {
        const target = message.mentions.users.first();
        let description;

        const waveMessages = [
            "saluda alegremente 👋",
            "dice ¡hola! con entusiasmo ✨",
            "agita la mano con energía 💫",
            "da un saludo amistoso 🌟",
            "saluda con una sonrisa brillante ⭐",
            "comparte un saludo cálido 🎈",
            "envía saludos positivos 🌈",
            "saluda con mucho ánimo 🎊"
        ];

        const targetMessages = [
            "saluda con mucha energía a",
            "envía un saludo especial a",
            "comparte un momento amistoso con",
            "saluda calurosamente a",
            "da la bienvenida con alegría a",
            "saluda con entusiasmo a",
            "envía buenos deseos a",
            "comparte su alegría saludando a"
        ];

        const randomWaveMessage = waveMessages[Math.floor(Math.random() * waveMessages.length)];
        const randomTargetMessage = targetMessages[Math.floor(Math.random() * targetMessages.length)];
        const gifUrl = await getGif('anime wave hello');

        if (target) {
            description = `**${message.author}** ${randomTargetMessage} **${target}** 👋`;
        } else {
            description = `**${message.author}** ${randomWaveMessage}`;
        }

        const embed = createEmbed(
            '👋 ¡Saludos!',
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

        const waveMessages = [
            "saluda alegremente 👋",
            "dice ¡hola! con entusiasmo ✨",
            "agita la mano con energía 💫",
            "da un saludo amistoso 🌟",
            "saluda con una sonrisa brillante ⭐",
            "comparte un saludo cálido 🎈",
            "envía saludos positivos 🌈",
            "saluda con mucho ánimo 🎊"
        ];

        const targetMessages = [
            "saluda con mucha energía a",
            "envía un saludo especial a",
            "comparte un momento amistoso con",
            "saluda calurosamente a",
            "da la bienvenida con alegría a",
            "saluda con entusiasmo a",
            "envía buenos deseos a",
            "comparte su alegría saludando a"
        ];

        const randomWaveMessage = waveMessages[Math.floor(Math.random() * waveMessages.length)];
        const randomTargetMessage = targetMessages[Math.floor(Math.random() * targetMessages.length)];
        const gifUrl = await getGif('anime wave hello');

        if (target) {
            description = `**${interaction.user}** ${randomTargetMessage} **${target}** 👋`;
        } else {
            description = `**${interaction.user}** ${randomWaveMessage}`;
        }

        const embed = createEmbed(
            '👋 ¡Saludos!',
            description
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        await interaction.reply({ embeds: [embed] });
    }
};
