const { createEmbed } = require('../../utils/embed.js');
const { getGif } = require('../../utils/tenor.js');

module.exports = {
    name: 'kiss',
    description: '💋 ¡Dale un beso dulce a alguien especial!',
    aliases: ['beso', 'besar'],
    cooldown: 3,
    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('❌ ¡Menciona a alguien para darle un beso!');
        }

        const kissMessages = [
            "da un dulce beso lleno de cariño 💕",
            "comparte un beso tierno y suave 💝",
            "da un beso lleno de amor ❤️",
            "expresa su afecto con un beso especial 🌟",
            "da un beso mágico y dulce ✨"
        ];

        const randomMessage = kissMessages[Math.floor(Math.random() * kissMessages.length)];
        const gifUrl = await getGif('anime kiss');

        const embed = createEmbed(
            '💋 ¡Momento Dulce!',
            `${message.author} ${randomMessage} ${target}`
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        message.channel.send({ embeds: [embed] });
    },
};