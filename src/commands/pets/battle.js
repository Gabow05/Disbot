const { createEmbed } = require('../../utils/embed.js');
const { getPet } = require('../../utils/database.js');
const { checkAchievementProgress } = require('../../utils/achievements.js');

function calculateDamage(attacker, defender) {
    const baseDamage = attacker.attack - (defender.defense * 0.5);
    const variance = Math.random() * 0.2 - 0.1; // ±10% variación
    return Math.max(1, Math.floor(baseDamage * (1 + variance)));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    name: 'pet-battle',
    description: 'Inicia una batalla entre mascotas',
    aliases: ['battle'],
    cooldown: 300, // 5 minutos entre batallas
    async execute(message, args) {
        const [petId1, petId2] = args.map(id => parseInt(id));
        if (!petId1 || !petId2) {
            return message.reply('Uso: !pet-battle [ID_TU_MASCOTA] [ID_MASCOTA_RIVAL]');
        }

        const pet1 = getPet(petId1);
        const pet2 = getPet(petId2);

        if (!pet1 || !pet2) {
            return message.reply('Una o ambas mascotas no fueron encontradas.');
        }

        if (pet1.user_id !== message.author.id) {
            return message.reply('La primera mascota debe ser tuya.');
        }

        // Crear copias de las mascotas para la batalla
        const fighter1 = { ...pet1, currentHealth: pet1.health };
        const fighter2 = { ...pet2, currentHealth: pet2.health };

        const battleEmbed = createEmbed(
            '⚔️ ¡Batalla de Mascotas!',
            `${fighter1.name} (Nivel ${fighter1.level}) VS ${fighter2.name} (Nivel ${fighter2.level})\n\n` +
            `${fighter1.name}: ❤️ ${fighter1.currentHealth}/${fighter1.health}\n` +
            `${fighter2.name}: ❤️ ${fighter2.currentHealth}/${fighter2.health}`
        );

        const battleMsg = await message.channel.send({ embeds: [battleEmbed] });
        let round = 1;

        while (fighter1.currentHealth > 0 && fighter2.currentHealth > 0) {
            await sleep(2000); // Esperar 2 segundos entre turnos

            // Turno mascota 1
            const damage1 = calculateDamage(fighter1, fighter2);
            fighter2.currentHealth -= damage1;

            // Turno mascota 2 (si aún vive)
            let damage2 = 0;
            if (fighter2.currentHealth > 0) {
                damage2 = calculateDamage(fighter2, fighter1);
                fighter1.currentHealth -= damage2;
            }

            const roundEmbed = createEmbed(
                `Ronda ${round}`,
                `${fighter1.name} hizo ${damage1} de daño a ${fighter2.name}!\n` +
                (damage2 > 0 ? `${fighter2.name} hizo ${damage2} de daño a ${fighter1.name}!\n\n` : '\n\n') +
                `${fighter1.name}: ❤️ ${Math.max(0, fighter1.currentHealth)}/${fighter1.health}\n` +
                `${fighter2.name}: ❤️ ${Math.max(0, fighter2.currentHealth)}/${fighter2.health}`
            );

            await battleMsg.edit({ embeds: [roundEmbed] });
            round++;
        }

        // Determinar ganador
        const winner = fighter1.currentHealth > 0 ? fighter1 : fighter2;
        const loser = fighter1.currentHealth > 0 ? fighter2 : fighter1;

        // Si el jugador ganó, verificar logros
        if (winner.user_id === message.author.id) {
            await checkAchievementProgress(message, 'BATTLE_CHAMPION', 1);
        }

        const finalEmbed = createEmbed(
            '🏆 ¡Batalla Finalizada!',
            `¡${winner.name} ha ganado la batalla!\n\n` +
            `**Estadísticas finales:**\n` +
            `${winner.name}: ❤️ ${Math.max(0, winner.currentHealth)}/${winner.health}\n` +
            `${loser.name}: ❤️ 0/${loser.health}\n\n` +
            `La batalla duró ${round - 1} rondas.`
        );

        await battleMsg.edit({ embeds: [finalEmbed] });
    },
};