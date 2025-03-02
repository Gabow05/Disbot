const { createEmbed } = require('../../utils/embed.js');

module.exports = {
    name: '8ball',
    description: 'Ask the magic 8ball a question',
    aliases: ['8b'],
    cooldown: 3,
    async execute(message, args) {
        if (!args.length) {
            return message.reply('Please ask a question!');
        }

        const responses = [
            'It is certain.',
            'It is decidedly so.',
            'Without a doubt.',
            'Yes definitely.',
            'You may rely on it.',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Yes.',
            'Signs point to yes.',
            'Reply hazy, try again.',
            'Ask again later.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Don\'t count on it.',
            'My reply is no.',
            'My sources say no.',
            'Outlook not so good.',
            'Very doubtful.'
        ];

        const response = responses[Math.floor(Math.random() * responses.length)];
        const question = args.join(' ');

        const embed = createEmbed(
            '🎱 Magic 8-Ball',
            `**Question:** ${question}\n**Answer:** ${response}`
        );

        message.channel.send({ embeds: [embed] });
    },
};
