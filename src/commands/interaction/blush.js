const { createEmbed } = require('../../utils/embed.js');
const { getGif } = require('../../utils/tenor.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'blush',
    description: '😊 ¡Sonrojarse de forma tierna!',
    aliases: ['sonrojar', 'ruborizar'],
    cooldown: 3,
    slashCommand: true,
    options: new SlashCommandBuilder()
        .setName('blush')
        .setDescription('¡Sonrojarse de forma tierna!')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario que te hizo sonrojar (opcional)')
                .setRequired(false)
        ),

    async execute(message, args) {
        const target = message.mentions.users.first();
        let description;

        const blushMessages = [
            "se sonroja intensamente 😊",
            "se pone rojo como un tomate 🍅",
            "se ruboriza tímidamente ☺️",
            "siente sus mejillas arder 🥰",
            "se sonroja hasta las orejas 😳",
            "intenta ocultar su sonrojo 🙈",
            "se pone colorado de vergüenza 💗",
            "brilla con un sonrojo adorable ✨"
        ];

        const randomMessage = blushMessages[Math.floor(Math.random() * blushMessages.length)];
        const gifUrl = await getGif('anime blush');

        if (target) {
            description = `**${message.author}** ${randomMessage} por **${target}**`;
        } else {
            description = `**${message.author}** ${randomMessage}`;
        }

        const embed = createEmbed(
            '😊 ¡Momento Tierno!',
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

        const blushMessages = [
            "se sonroja intensamente 😊",
            "se pone rojo como un tomate 🍅",
            "se ruboriza tímidamente ☺️",
            "siente sus mejillas arder 🥰",
            "se sonroja hasta las orejas 😳",
            "intenta ocultar su sonrojo 🙈",
            "se pone colorado de vergüenza 💗",
            "brilla con un sonrojo adorable ✨"
        ];

        const randomMessage = blushMessages[Math.floor(Math.random() * blushMessages.length)];
        const gifUrl = await getGif('anime blush');

        if (target) {
            description = `**${interaction.user}** ${randomMessage} por **${target}**`;
        } else {
            description = `**${interaction.user}** ${randomMessage}`;
        }

        const embed = createEmbed(
            '😊 ¡Momento Tierno!',
            description
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        await interaction.reply({ embeds: [embed] });
    }
};
