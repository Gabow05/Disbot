const { createEmbed } = require('../../utils/embed.js');

module.exports = {
    name: 'random',
    description: 'Generate a random number',
    aliases: ['roll'],
    cooldown: 3,
    async execute(message, args) {
        const max = parseInt(args[0]) || 100;
        const min = parseInt(args[1]) || 1;

        if (max < min) {
            return message.reply('The maximum number must be greater than the minimum number!');
        }

        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        const embed = createEmbed(
            'Random Number',
            `🎲 Your random number between ${min} and ${max} is: **${randomNum}**`
        );

        message.channel.send({ embeds: [embed] });
    },
};
