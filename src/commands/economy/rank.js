const { createEmbed } = require('../../utils/embed.js');
const { db } = require('../../utils/database.js');

module.exports = {
    name: 'rank',
    description: '🏆 Muestra el ranking de niveles del servidor',
    aliases: ['ranking', 'top'],
    cooldown: 10,
    async execute(message, args) {
        try {
            // Obtener top 10 usuarios por nivel y experiencia
            const result = await db.query(
                `SELECT user_id, level, experience 
                FROM user_levels 
                ORDER BY level DESC, experience DESC 
                LIMIT 10`
            );

            if (!result.rows.length) {
                return message.reply('¡Aún no hay usuarios en el ranking! Sé el primero en ganar experiencia.');
            }

            // Emojis para las posiciones
            const positionEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

            // Crear lista de usuarios
            let rankingList = '';
            for (let i = 0; i < result.rows.length; i++) {
                const user = result.rows[i];
                const member = await message.guild.members.fetch(user.user_id).catch(() => null);
                if (member) {
                    const nextLevelExp = user.level * 100;
                    rankingList += `${positionEmojis[i]} **${member.user.username}**\n` +
                                 `> Nivel ${user.level} • ${user.experience}/${nextLevelExp} XP\n\n`;
                }
            }

            // Encontrar la posición del usuario que ejecuta el comando
            const userRank = await db.query(
                `SELECT COUNT(*) as rank 
                FROM user_levels 
                WHERE level > (SELECT level FROM user_levels WHERE user_id = $1)
                OR (level = (SELECT level FROM user_levels WHERE user_id = $1) 
                    AND experience > (SELECT experience FROM user_levels WHERE user_id = $1))`,
                [message.author.id]
            );

            const userPosition = userRank.rows[0].rank + 1;

            const embed = createEmbed(
                '🏆 Ranking de Niveles',
                `¡Los usuarios más activos del servidor!\n\n${rankingList}\n` +
                `Tu posición: #${userPosition}`
            );

            embed.setFooter({ 
                text: '¡Sistema de niveles creado por Gabow! 💫'
            });

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error en comando rank:', error);
            message.reply('❌ ¡Hubo un error al obtener el ranking! Por favor, intenta nuevamente.');
        }
    },
};
