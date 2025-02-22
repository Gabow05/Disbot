const { createEmbed } = require('../../utils/embed.js');
const { getUser } = require('../../utils/database.js');

module.exports = {
    name: 'balance',
    description: 'Ver tu balance y estadísticas',
    aliases: ['bal', 'money'],
    cooldown: 5,
    async execute(message, args) {
        try {
            const targetUser = message.mentions.users.first() || message.author;
            const userData = await getUser(targetUser.id);

            const embed = createEmbed(
                '💰 Balance y Estadísticas',
                `**Usuario:** ${targetUser.tag}\n\n` +
                `🪙 **Balance:** ${userData.coins} monedas\n` +
                `🔥 **Racha diaria:** ${userData.daily_streak} días\n` +
                `📈 **Último trabajo:** ${userData.last_work ? new Date(userData.last_work).toLocaleString() : 'Nunca'}\n` +
                `🎁 **Última recompensa diaria:** ${userData.last_daily ? new Date(userData.last_daily).toLocaleString() : 'Nunca'}`
            );

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error en comando balance:', error);
            message.reply('¡Hubo un error al obtener tu balance! Por favor, intenta nuevamente.');
        }
    },
};