const { createEmbed } = require('../../utils/embed.js');
const { getGif } = require('../../utils/tenor.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'bang',
    description: '💥 ¡Dispara de forma divertida!',
    aliases: ['disparar', 'shoot'],
    cooldown: 3,
    slashCommand: true,
    options: new SlashCommandBuilder()
        .setName('bang')
        .setDescription('¡Dispara de forma divertida!')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario a quien disparar')
                .setRequired(true)
        ),

    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('❌ ¡Menciona a alguien para dispararle!');
        }

        const bangMessages = [
            "dispara una pistola de agua a",
            "lanza confeti a",
            "dispara burbujas de jabón a",
            "dispara rayos láser de amor a",
            "dispara un cañón de peluches a",
            "dispara estrellas brillantes a",
            "lanza corazones a",
            "dispara arcoíris a"
        ];

        const effects = [
            "¡BANG! 💥",
            "¡PEW PEW! 🔫",
            "¡SPLASH! 💦",
            "¡BOOM! 🎉",
            "¡POW! ⭐",
            "¡ZAP! ✨"
        ];

        const randomMessage = bangMessages[Math.floor(Math.random() * bangMessages.length)];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        const gifUrl = await getGif('anime gun funny');

        const embed = createEmbed(
            `${randomEffect} ¡Disparo Divertido!`,
            `**${message.author}** ${randomMessage} **${target}**\n${randomEffect}`
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        message.channel.send({ embeds: [embed] });
    },

    async slashExecute(interaction) {
        const target = interaction.options.getUser('usuario');
        
        const bangMessages = [
            "dispara una pistola de agua a",
            "lanza confeti a",
            "dispara burbujas de jabón a",
            "dispara rayos láser de amor a",
            "dispara un cañón de peluches a",
            "dispara estrellas brillantes a",
            "lanza corazones a",
            "dispara arcoíris a"
        ];

        const effects = [
            "¡BANG! 💥",
            "¡PEW PEW! 🔫",
            "¡SPLASH! 💦",
            "¡BOOM! 🎉",
            "¡POW! ⭐",
            "¡ZAP! ✨"
        ];

        const randomMessage = bangMessages[Math.floor(Math.random() * bangMessages.length)];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        const gifUrl = await getGif('anime gun funny');

        const embed = createEmbed(
            `${randomEffect} ¡Disparo Divertido!`,
            `**${interaction.user}** ${randomMessage} **${target}**\n${randomEffect}`
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        await interaction.reply({ embeds: [embed] });
    }
};
