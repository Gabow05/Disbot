const { createEmbed } = require('../../utils/embed.js');
const { getAchievements } = require('../../utils/database.js');
const { achievements } = require('../../utils/achievements.js');

module.exports = {
    name: 'achievements',
    description: 'Ver tus logros y progreso',
    aliases: ['logros', 'ach'],
    cooldown: 5,
    async execute(message, args) {
        try {
            const userAchievements = await getAchievements(message.author.id);

            const achievementList = Object.entries(achievements).map(([key, ach]) => {
                const userProgress = userAchievements.find(ua => ua.achievement_id === ach.id) || { progress: 0, completed: false };
                const currentLevel = ach.levels.find(l => l.requirement > userProgress.progress) || ach.levels[ach.levels.length - 1];
                const previousLevel = ach.levels.find(l => l.requirement <= userProgress.progress);
                const nextLevel = ach.levels.find(l => l.requirement > userProgress.progress);

                let progressBar = '';
                if (previousLevel && nextLevel) {
                    const progress = ((userProgress.progress - previousLevel.requirement) / 
                        (nextLevel.requirement - previousLevel.requirement)) * 10;
                    progressBar = '▰'.repeat(Math.floor(progress)) + '▱'.repeat(10 - Math.floor(progress));
                } else if (!previousLevel) {
                    const progress = (userProgress.progress / nextLevel.requirement) * 10;
                    progressBar = '▰'.repeat(Math.floor(progress)) + '▱'.repeat(10 - Math.floor(progress));
                } else {
                    progressBar = '▰'.repeat(10); // Completado
                }

                return `${previousLevel ? previousLevel.emoji : '⭐'} **${ach.name}**\n` +
                    `${ach.description}\n` +
                    `Progreso: ${userProgress.progress}/${currentLevel.requirement}\n` +
                    `${progressBar} \n` +
                    `Siguiente recompensa: ${currentLevel.reward} 🪙\n` +
                    (userProgress.completed ? '✅ ¡Completado!' : '🔄 En progreso') + '\n';
            }).join('\n──────────\n');

            const totalCompleted = userAchievements.filter(a => a.completed).length;
            const totalAchievements = Object.keys(achievements).length;

            const embed = createEmbed(
                '🏆 Logros y Progreso',
                `Aquí están tus logros, ${message.author.username}:\n` +
                `Completados: ${totalCompleted}/${totalAchievements}\n\n` +
                achievementList
            );

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error en comando achievements:', error);
            message.reply('¡Hubo un error al obtener tus logros! Por favor, intenta nuevamente.');
        }
    },
};