const { createEmbed } = require('../../utils/embed.js');
const { addCoins, setLastWork, getUser } = require('../../utils/database.js');

const jobs = [
    { name: 'Programador', pay: [100, 500], message: 'escribiste código y arreglaste bugs' },
    { name: 'YouTuber', pay: [200, 400], message: 'subiste un video viral' },
    { name: 'Chef', pay: [150, 350], message: 'preparaste un platillo exquisito' },
    { name: 'Artista', pay: [180, 450], message: 'vendiste una obra de arte digital' },
    { name: 'Gamer', pay: [120, 300], message: 'ganaste un torneo de esports' }
];

module.exports = {
    name: 'work',
    description: 'Trabaja para ganar monedas',
    aliases: ['w'],
    cooldown: 3600, // 1 hora de cooldown
    async execute(message, args) {
        const userId = message.author.id;
        const user = getUser(userId);

        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const earnedCoins = Math.floor(Math.random() * (job.pay[1] - job.pay[0])) + job.pay[0];

        // Agregar monedas al usuario y actualizar último trabajo
        addCoins(userId, earnedCoins);
        setLastWork(userId);

        const embed = createEmbed(
            '💼 ¡Trabajaste!',
            `Trabajaste como ${job.name} y ${job.message}.\n\n` +
            `¡Ganaste ${earnedCoins} 🪙 monedas!\n` +
            `Balance actual: ${user.coins + earnedCoins} 🪙`
        );

        message.channel.send({ embeds: [embed] });
    },
};