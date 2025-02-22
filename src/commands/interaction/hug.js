const { createEmbed } = require('../../utils/embed.js');

module.exports = {
    name: 'hug',
    description: 'Hug someone!',
    cooldown: 3,
    async execute(message, args) {
        const target = message.mentions.users.first() || message.author;
        const hugMessages = [
            "gives a big warm hug! 🤗",
            "wraps their arms around them in a cozy embrace! 💝",
            "shares a friendly hug! 🫂"
        ];

        const randomMessage = hugMessages[Math.floor(Math.random() * hugMessages.length)];
        const embed = createEmbed(
            'Hug Time!',
            `${message.author} ${randomMessage} ${target}`
        );

        message.channel.send({ embeds: [embed] });
    },
};
