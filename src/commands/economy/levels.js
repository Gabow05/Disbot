const { createEmbed } = require('../../utils/embed.js');
const { db } = require('../../utils/database.js');

module.exports = {
    name: 'levels',
    description: '📊 Muestra tu nivel y experiencia actual',
    aliases: ['level', 'xp', 'exp'],
    cooldown: 5,
    async execute(message, args) {
        try {
            // Obtener nivel del usuario
            const result = await db.query(
                'SELECT level, experience FROM user_levels WHERE user_id = $1',
                [message.author.id]
            );

            // Si el usuario no existe en la base de datos, crearlo
            if (!result.rows.length) {
                await db.query(
                    'INSERT INTO user_levels (user_id, level, experience) VALUES ($1, 1, 0)',
                    [message.author.id]
                );
                result.rows = [{ level: 1, experience: 0 }];
            }

            const userLevel = result.rows[0];
            const nextLevelExp = userLevel.level * 100; // Experiencia necesaria para el siguiente nivel
            const currentExp = userLevel.experience;
            const progress = (currentExp / nextLevelExp) * 10; // Para la barra de progreso
            const progressBar = '▰'.repeat(Math.floor(progress)) + '▱'.repeat(10 - Math.floor(progress));

            const levelEmojis = ['🌱', '🌿', '🌳', '🌺', '🌸', '🌹', '👑'];
            const currentLevelEmoji = levelEmojis[Math.min(Math.floor(userLevel.level / 10), levelEmojis.length - 1)];

            const embed = createEmbed(
                `${currentLevelEmoji} Nivel de ${message.author.username}`,
                `**Nivel Actual:** ${userLevel.level}\n` +
                `**Experiencia:** ${currentExp}/${nextLevelExp}\n` +
                `**Progreso:** ${progressBar} (${Math.floor((currentExp / nextLevelExp) * 100)}%)\n\n` +
                `🎯 **Siguiente nivel en:** ${nextLevelExp - currentExp} XP\n` +
                `✨ ¡Sigue participando en el servidor para ganar experiencia!`
            );

            // Agregar una nota sobre cómo ganar experiencia
            embed.addFields({
                name: '📝 ¿Cómo ganar experiencia?',
                value: '• Enviar mensajes en el servidor\n' +
                      '• Usar comandos de interacción\n' +
                      '• Participar en eventos y juegos\n' +
                      '• ¡Y mucho más!',
                inline: false
            });

            embed.setFooter({ 
                text: '¡Sistema de niveles creado por Gabow! 💫'
            });

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error en comando levels:', error);
            message.reply('❌ ¡Hubo un error al obtener tu información de nivel! Por favor, intenta nuevamente.');
        }
    },
};
