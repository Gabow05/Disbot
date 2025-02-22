const { createEmbed } = require('../../utils/embed.js');

module.exports = {
    name: 'rps',
    description: 'Play Rock, Paper, Scissors!',
    aliases: ['rockpaperscissors'],
    cooldown: 3,
    async execute(message, args) {
        const choices = ['rock', 'paper', 'scissors'];
        const userChoice = args[0]?.toLowerCase();

        if (!userChoice || !choices.includes(userChoice)) {
            return message.reply('Please specify rock, paper, or scissors!');
        }

        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        let result;

        if (userChoice === botChoice) {
            result = "It's a tie!";
        } else if (
            (userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')
        ) {
            result = 'You win!';
        } else {
            result = 'I win!';
        }

        const embed = createEmbed(
            'Rock, Paper, Scissors!',
            `You chose: ${userChoice}\nI chose: ${botChoice}\n\n${result}`
        );

        message.channel.send({ embeds: [embed] });
    },
};
