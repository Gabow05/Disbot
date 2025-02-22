const { createEmbed } = require('../../utils/embed.js');

module.exports = {
    name: 'kiss',
    description: 'Kiss someone!',
    cooldown: 3,
    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('Please mention someone to kiss!');
        }

        const kissMessages = [
            "plants a sweet kiss! 💋",
            "gives a gentle kiss! 😘",
            "shares a loving kiss! 💕"
        ];

        const randomMessage = kissMessages[Math.floor(Math.random() * kissMessages.length)];
        const embed = createEmbed(
            'Kiss!',
            `${message.author} ${randomMessage} ${target}`
        );

        message.channel.send({ embeds: [embed] });
    },
};
