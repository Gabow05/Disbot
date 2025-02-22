const { createEmbed } = require('./embed.js');
const { updateAchievementProgress, completeAchievement, addCoins } = require('./database.js');

const achievements = {
    DAILY_STREAK: {
        id: 'daily_streak',
        name: '¡Constancia!',
        description: 'Mantén una racha de recompensas diarias',
        levels: [
            { requirement: 7, reward: 1000, emoji: '🥉' },
            { requirement: 30, reward: 5000, emoji: '🥈' },
            { requirement: 100, reward: 20000, emoji: '🥇' }
        ]
    },
    PET_MASTER: {
        id: 'pet_master',
        name: 'Maestro de Mascotas',
        description: 'Entrena a tus mascotas',
        levels: [
            { requirement: 10, reward: 1500, emoji: '🐾' },
            { requirement: 50, reward: 7500, emoji: '🎯' },
            { requirement: 200, reward: 25000, emoji: '👑' }
        ]
    },
    BATTLE_CHAMPION: {
        id: 'battle_champion',
        name: 'Campeón de Batallas',
        description: 'Gana batallas con tus mascotas',
        levels: [
            { requirement: 5, reward: 2000, emoji: '⚔️' },
            { requirement: 25, reward: 10000, emoji: '🏆' },
            { requirement: 100, reward: 30000, emoji: '👑' }
        ]
    },
    WORK_ETHIC: {
        id: 'work_ethic',
        name: 'Ética Laboral',
        description: 'Trabaja constantemente',
        levels: [
            { requirement: 50, reward: 3000, emoji: '💼' },
            { requirement: 200, reward: 15000, emoji: '💪' },
            { requirement: 1000, reward: 50000, emoji: '🌟' }
        ]
    },
    COLLECTOR: {
        id: 'collector',
        name: 'Coleccionista',
        description: 'Colecciona items diferentes',
        levels: [
            { requirement: 10, reward: 2000, emoji: '📦' },
            { requirement: 25, reward: 8000, emoji: '🎁' },
            { requirement: 50, reward: 20000, emoji: '🏆' }
        ]
    }
};

async function checkAchievementProgress(message, achievementId, currentProgress) {
    try {
        const achievement = achievements[achievementId];
        if (!achievement) return;

        const userId = message.author.id;
        const progress = await updateAchievementProgress(userId, achievement.id, currentProgress);

        // Verificar si se alcanzó algún nivel
        for (const level of achievement.levels) {
            if (progress.progress >= level.requirement && !progress.completed) {
                try {
                    const completed = await completeAchievement(userId, achievement.id);
                    if (completed) {
                        // Dar recompensa
                        await addCoins(userId, level.reward);

                        // Enviar mensaje de logro
                        const embed = createEmbed(
                            `${level.emoji} ¡Logro Desbloqueado!`,
                            `¡Felicitaciones! Has conseguido el logro "${achievement.name}"\n` +
                            `${achievement.description}\n\n` +
                            `Nivel alcanzado: ${level.requirement}\n` +
                            `Recompensa: ${level.reward} 🪙`
                        );

                        message.channel.send({ embeds: [embed] });
                    }
                } catch (error) {
                    console.error('Error al completar logro:', error);
                }
            }
        }
    } catch (error) {
        console.error('Error al actualizar progreso de logro:', error);
    }
}

module.exports = {
    achievements,
    checkAchievementProgress
};