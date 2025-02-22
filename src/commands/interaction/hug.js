const { createEmbed } = require('../../utils/embed.js');
const { getGif } = require('../../utils/tenor.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'hug',
    description: '🤗 ¡Da un abrazo a alguien especial!',
    aliases: ['abrazo', 'abrazar'],
    cooldown: 3,
    // Configuración para comando de barra
    slashCommand: true,
    options: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('¡Da un abrazo a alguien especial!')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario a quien dar el abrazo')
                .setRequired(true)
        ),

    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('❌ ¡Menciona a alguien para abrazarlo!');
        }

        const hugMessages = [
            "le da un cálido abrazo de oso 🐻",
            "envuelve en un abrazo acogedor 🤗",
            "comparte un abrazo lleno de cariño 💝",
            "da el mejor abrazo del mundo 🌟",
            "abraza con todo su corazón ❤️"
        ];

        const randomMessage = hugMessages[Math.floor(Math.random() * hugMessages.length)];
        const gifUrl = await getGif('anime hug');

        const embed = createEmbed(
            '🤗 ¡Tiempo de Abrazos!',
            `${message.author} ${randomMessage} ${target}`
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        message.channel.send({ embeds: [embed] });
    },

    // Manejador para comando de barra
    async slashExecute(interaction) {
        const target = interaction.options.getUser('usuario');

        const hugMessages = [
            "le da un cálido abrazo de oso 🐻",
            "envuelve en un abrazo acogedor 🤗",
            "comparte un abrazo lleno de cariño 💝",
            "da el mejor abrazo del mundo 🌟",
            "abraza con todo su corazón ❤️"
        ];

        const randomMessage = hugMessages[Math.floor(Math.random() * hugMessages.length)];
        const gifUrl = await getGif('anime hug');

        const embed = createEmbed(
            '🤗 ¡Tiempo de Abrazos!',
            `${interaction.user} ${randomMessage} ${target}`
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        await interaction.reply({ embeds: [embed] });
    }
};