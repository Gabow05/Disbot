const { db } = require('./database.js');
const { createEmbed } = require('./embed.js');

const XP_PER_MESSAGE = 5; // XP base por mensaje
const XP_COOLDOWN = 60000; // 1 minuto entre ganancia de XP

async function addExperience(message) {
    try {
        const now = new Date();
        
        // Verificar cooldown
        const lastMessage = await db.query(
            'SELECT last_message_timestamp FROM user_levels WHERE user_id = $1',
            [message.author.id]
        );

        if (lastMessage.rows.length && 
            (now - new Date(lastMessage.rows[0].last_message_timestamp)) < XP_COOLDOWN) {
            return;
        }

        // Calcular XP random (entre 5 y 15)
        const xpToAdd = Math.floor(Math.random() * 11) + XP_PER_MESSAGE;

        // Comenzar transacción
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // Insertar o actualizar usuario
            const result = await client.query(
                `INSERT INTO user_levels (user_id, experience, level, last_message_timestamp)
                VALUES ($1, $2, 1, NOW())
                ON CONFLICT (user_id)
                DO UPDATE SET 
                    experience = user_levels.experience + $2,
                    last_message_timestamp = NOW()
                RETURNING experience, level`,
                [message.author.id, xpToAdd]
            );

            const { experience, level } = result.rows[0];
            const nextLevelExp = level * 100;

            // Verificar si subió de nivel
            if (experience >= nextLevelExp) {
                const newLevel = level + 1;
                await client.query(
                    'UPDATE user_levels SET level = $1, experience = $2 WHERE user_id = $3',
                    [newLevel, experience - nextLevelExp, message.author.id]
                );

                // Enviar mensaje de nivel alcanzado
                const levelEmojis = ['🌱', '🌿', '🌳', '🌺', '🌸', '🌹', '👑'];
                const newLevelEmoji = levelEmojis[Math.min(Math.floor(newLevel / 10), levelEmojis.length - 1)];

                const embed = createEmbed(
                    `${newLevelEmoji} ¡Subiste de Nivel!`,
                    `¡Felicidades **${message.author.username}**!\n` +
                    `Has alcanzado el **nivel ${newLevel}**\n\n` +
                    `🎉 ¡Sigue así! El siguiente nivel te espera...`
                );

                message.channel.send({ embeds: [embed] });
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error al añadir experiencia:', error);
    }
}

module.exports = {
    addExperience
};
