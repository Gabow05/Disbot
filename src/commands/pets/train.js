const { createEmbed } = require('../../utils/embed.js');
const { getPet, updatePetStats } = require('../../utils/database.js');

const trainingTypes = [
    { name: 'Físico', emoji: '💪', stats: { health: 5, attack: 3, defense: 2 } },
    { name: 'Combate', emoji: '⚔️', stats: { health: 2, attack: 5, defense: 3 } },
    { name: 'Defensa', emoji: '🛡️', stats: { health: 3, attack: 2, defense: 5 } },
    { name: 'Equilibrado', emoji: '⚖️', stats: { health: 3, attack: 3, defense: 3 } }
];

module.exports = {
    name: 'pet-train',
    description: 'Entrena a tu mascota para mejorar sus estadísticas',
    aliases: ['train'],
    cooldown: 3600, // 1 hora entre entrenamientos
    async execute(message, args) {
        const petId = parseInt(args[0]);
        if (!petId) {
            return message.reply('¡Necesitas especificar el ID de tu mascota! Usa `!pet-info` para ver tus mascotas.');
        }

        const pet = getPet(petId);
        if (!pet || pet.user_id !== message.author.id) {
            return message.reply('No se encontró la mascota o no te pertenece.');
        }

        const training = trainingTypes[Math.floor(Math.random() * trainingTypes.length)];
        const expGained = Math.floor(Math.random() * 20) + 10;
        const newExp = pet.exp + expGained;
        const levelUp = newExp >= pet.level * 100;
        const newLevel = levelUp ? pet.level + 1 : pet.level;

        // Calcular nuevas estadísticas
        const levelBonus = levelUp ? { health: 10, attack: 5, defense: 5 } : { health: 0, attack: 0, defense: 0 };
        const newStats = {
            level: newLevel,
            exp: levelUp ? newExp - (pet.level * 100) : newExp,
            health: pet.health + training.stats.health + levelBonus.health,
            attack: pet.attack + training.stats.attack + levelBonus.attack,
            defense: pet.defense + training.stats.defense + levelBonus.defense
        };

        // Actualizar estadísticas
        updatePetStats(petId, newStats);

        const embed = createEmbed(
            `${training.emoji} ¡Entrenamiento Completado!`,
            `**${pet.name}** completó su entrenamiento ${training.name}!\n\n` +
            `EXP ganada: +${expGained}\n` +
            (levelUp ? `🎉 ¡Subió al nivel ${newLevel}!\n\n` : '\n') +
            '**Mejoras:**\n' +
            `❤️ Salud: +${training.stats.health + levelBonus.health}\n` +
            `⚔️ Ataque: +${training.stats.attack + levelBonus.attack}\n` +
            `🛡️ Defensa: +${training.stats.defense + levelBonus.defense}\n\n` +
            '**Estadísticas actuales:**\n' +
            `Nivel: ${newStats.level}\n` +
            `EXP: ${newStats.exp}/${newStats.level * 100}\n` +
            `❤️ Salud: ${newStats.health}\n` +
            `⚔️ Ataque: ${newStats.attack}\n` +
            `🛡️ Defensa: ${newStats.defense}`
        );

        message.channel.send({ embeds: [embed] });
    },
};
