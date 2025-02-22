const { createEmbed } = require('../../utils/embed.js');
const { getGif } = require('../../utils/tenor.js');

module.exports = {
    name: 'pat',
    description: '✨ ¡Dale palmaditas cariñosas a alguien!',
    aliases: ['palmada', 'acariciar'],
    cooldown: 3,
    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('❌ ¡Menciona a alguien para darle palmaditas!');
        }

        const patMessages = [
            "da palmaditas suaves y cariñosas 🌸",
            "acaricia con dulzura ✨",
            "da palmaditas llenas de afecto 💫",
            "muestra su cariño con suaves palmaditas 🎀",
            "comparte un momento tierno con palmaditas 💝"
        ];

        const randomMessage = patMessages[Math.floor(Math.random() * patMessages.length)];
        const gifUrl = await getGif('anime pat head');

        const embed = createEmbed(
            '✨ ¡Palmaditas Cariñosas!',
            `${message.author} ${randomMessage} ${target}`
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        message.channel.send({ embeds: [embed] });
    },
};