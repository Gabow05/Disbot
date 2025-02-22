const { createEmbed } = require('../../utils/embed.js');
const { addCoins, setLastDaily, getUser } = require('../../utils/database.js');
const { checkAchievementProgress } = require('../../utils/achievements.js');

module.exports = {
    name: 'daily',
    description: 'Recibe tu recompensa diaria',
    cooldown: 86400, // 24 horas
    async execute(message, args) {
        try {
            const userId = message.author.id;
            const user = await getUser(userId);

            const dailyCoins = 1000;
            const streakBonus = user.daily_streak * 100; // 100 monedas extra por cada día consecutivo
            const randomBonus = Math.floor(Math.random() * 500); // Bonus aleatorio

            // Actualizar racha y agregar monedas
            const newStreak = (user.daily_streak || 0) + 1;
            await setLastDaily(userId, newStreak);
            await addCoins(userId, dailyCoins + streakBonus + randomBonus);

            // Verificar logros
            await checkAchievementProgress(message, 'DAILY_STREAK', 1);

            const embed = createEmbed(
                '🎁 Recompensa Diaria',
                `¡Has recibido tu recompensa diaria!\n\n` +
                `💰 Monedas base: ${dailyCoins}\n` +
                `🔥 Racha actual: ${newStreak} días\n` +
                `⭐ Bonus por racha: ${streakBonus}\n` +
                `✨ Bonus aleatorio: ${randomBonus}\n` +
                `📊 Total: ${dailyCoins + streakBonus + randomBonus} 🪙\n\n` +
                `Balance actual: ${user.coins + dailyCoins + streakBonus + randomBonus} 🪙`
            );

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error en comando daily:', error);
            message.reply('¡Hubo un error al reclamar tu recompensa diaria! Por favor, intenta nuevamente.');
        }
    },
};