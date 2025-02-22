const { createEmbed } = require('../../utils/embed.js');

module.exports = {
    name: 'pat',
    description: 'Pat someone!',
    cooldown: 3,
    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('Please mention someone to pat!');
        }

        const patMessages = [
            "gently pats! 🤚",
            "gives a warm pat! ✋",
            "lovingly pats! 💫"
        ];

        const randomMessage = patMessages[Math.floor(Math.random() * patMessages.length)];
        const embed = createEmbed(
            'Pat Pat!',
            `${message.author} ${randomMessage} ${target}`
        );

        message.channel.send({ embeds: [embed] });
    },
};
