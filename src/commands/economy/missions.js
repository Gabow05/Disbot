const { createEmbed } = require('../../utils/embed.js');
const { getUserMissions, createMission, completeMission, addCoins } = require('../../utils/database.js');

const missionTypes = {
    DAILY: {
        duration: 24,
        missions: [
            { type: 'train_pet', description: 'Entrena a tu mascota {requirement} veces', minReq: 3, maxReq: 5, reward: 500 },
            { type: 'win_battles', description: 'Gana {requirement} batallas', minReq: 2, maxReq: 4, reward: 750 },
            { type: 'use_commands', description: 'Usa {requirement} comandos diferentes', minReq: 5, maxReq: 8, reward: 300 },
            { type: 'earn_coins', description: 'Gana {requirement} monedas', minReq: 1000, maxReq: 2000, reward: 1000 }
        ]
    },
    WEEKLY: {
        duration: 168, // 7 días
        missions: [
            { type: 'reach_streak', description: 'Mantén una racha de {requirement} días', minReq: 5, maxReq: 7, reward: 5000 },
            { type: 'level_up_pet', description: 'Sube de nivel a tu mascota {requirement} veces', minReq: 3, maxReq: 5, reward: 3000 },
            { type: 'win_ranked', description: 'Gana {requirement} batallas clasificatorias', minReq: 10, maxReq: 15, reward: 7500 },
            { type: 'complete_daily', description: 'Completa {requirement} misiones diarias', minReq: 15, maxReq: 20, reward: 10000 }
        ]
    }
};

async function generateMission(userId, missionType) {
    const typeConfig = missionTypes[missionType];
    const mission = typeConfig.missions[Math.floor(Math.random() * typeConfig.missions.length)];
    const requirement = Math.floor(Math.random() * (mission.maxReq - mission.minReq + 1)) + mission.minReq;

    try {
        const newMission = await createMission(
            userId,
            mission.type,
            mission.description.replace('{requirement}', requirement),
            requirement,
            mission.reward,
            '',  // Recompensas de items por implementar
            typeConfig.duration
        );
        return newMission;
    } catch (error) {
        console.error('Error generando misión:', error);
        throw error;
    }
}

module.exports = {
    name: 'missions',
    description: 'Ver y gestionar tus misiones activas',
    aliases: ['mission', 'quests'],
    cooldown: 5,
    async execute(message, args) {
        try {
            const userId = message.author.id;
            const subcommand = args[0]?.toLowerCase();

            if (subcommand === 'daily') {
                const newMission = await generateMission(userId, 'DAILY');
                const embed = createEmbed(
                    '📋 Nueva Misión Diaria',
                    `Has recibido una nueva misión:\n\n` +
                    `**${newMission.description}**\n` +
                    `Recompensa: ${newMission.reward_coins} 🪙\n` +
                    `Expira en: 24 horas`
                );
                return message.channel.send({ embeds: [embed] });
            }

            if (subcommand === 'weekly') {
                const newMission = await generateMission(userId, 'WEEKLY');
                const embed = createEmbed(
                    '📜 Nueva Misión Semanal',
                    `Has recibido una nueva misión semanal:\n\n` +
                    `**${newMission.description}**\n` +
                    `Recompensa: ${newMission.reward_coins} 🪙\n` +
                    `Expira en: 7 días`
                );
                return message.channel.send({ embeds: [embed] });
            }

            // Ver misiones activas
            const activeMissions = await getUserMissions(userId);
            if (!activeMissions.length) {
                return message.reply('No tienes misiones activas. Usa `!missions daily` o `!missions weekly` para obtener nuevas misiones.');
            }

            const embed = createEmbed(
                '📋 Misiones Activas',
                activeMissions.map(mission => {
                    const expiresAt = new Date(mission.expires_at);
                    const timeLeft = Math.max(0, Math.floor((expiresAt - new Date()) / 3600000)); // Horas restantes

                    return `**${mission.description}**\n` +
                        `Progreso: ${mission.progress}/${mission.requirement}\n` +
                        `Recompensa: ${mission.reward_coins} 🪙\n` +
                        `Tiempo restante: ${timeLeft} horas\n`;
                }).join('\n──────────\n')
            );

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error en comando missions:', error);
            message.reply('¡Hubo un error al gestionar las misiones! Por favor, intenta nuevamente.');
        }
    },
};