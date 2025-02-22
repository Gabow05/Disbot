const { createEmbed } = require('../../utils/embed.js');
const { getGif } = require('../../utils/tenor.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'highfive',
    description: '✋ ¡Choca esos cinco con alguien!',
    aliases: ['chocar', 'cinco'],
    cooldown: 3,
    slashCommand: true,
    options: new SlashCommandBuilder()
        .setName('highfive')
        .setDescription('¡Choca esos cinco con alguien!')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario con quien chocar los cinco')
                .setRequired(true)
        ),

    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('❌ ¡Menciona a alguien para chocar los cinco!');
        }

        const highfiveMessages = [
            "choca los cinco con energía con",
            "celebra con un high-five épico con",
            "comparte un momento de victoria con",
            "choca esos cinco de manera legendaria con",
            "demuestra su entusiasmo chocando los cinco con",
            "celebra el momento con un high-five con",
            "comparte la emoción chocando los cinco con",
            "hace un high-five épico con"
        ];

        const effects = [
            "¡SLAP! ✋",
            "¡HIGH FIVE! 🖐️",
            "¡CLAP! 👏",
            "¡YEAH! ⭐",
            "¡BOOM! 💥",
            "¡EPIC! ✨"
        ];

        const randomMessage = highfiveMessages[Math.floor(Math.random() * highfiveMessages.length)];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        const gifUrl = await getGif('anime high five');

        const embed = createEmbed(
            `${randomEffect} ¡High Five!`,
            `**${message.author}** ${randomMessage} **${target}**\n${randomEffect}`
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        message.channel.send({ embeds: [embed] });
    },

    async slashExecute(interaction) {
        const target = interaction.options.getUser('usuario');
        
        const highfiveMessages = [
            "choca los cinco con energía con",
            "celebra con un high-five épico con",
            "comparte un momento de victoria con",
            "choca esos cinco de manera legendaria con",
            "demuestra su entusiasmo chocando los cinco con",
            "celebra el momento con un high-five con",
            "comparte la emoción chocando los cinco con",
            "hace un high-five épico con"
        ];

        const effects = [
            "¡SLAP! ✋",
            "¡HIGH FIVE! 🖐️",
            "¡CLAP! 👏",
            "¡YEAH! ⭐",
            "¡BOOM! 💥",
            "¡EPIC! ✨"
        ];

        const randomMessage = highfiveMessages[Math.floor(Math.random() * highfiveMessages.length)];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        const gifUrl = await getGif('anime high five');

        const embed = createEmbed(
            `${randomEffect} ¡High Five!`,
            `**${interaction.user}** ${randomMessage} **${target}**\n${randomEffect}`
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        await interaction.reply({ embeds: [embed] });
    }
};
