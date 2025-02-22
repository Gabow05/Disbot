const { createEmbed } = require('../../utils/embed.js');
const { createPet } = require('../../utils/database.js');

const petTypes = [
    { name: 'Dragon', emoji: '🐲', baseStats: { health: 120, attack: 15, defense: 12 } },
    { name: 'Phoenix', emoji: '🦅', baseStats: { health: 100, attack: 18, defense: 10 } },
    { name: 'Unicorn', emoji: '🦄', baseStats: { health: 110, attack: 12, defense: 15 } },
    { name: 'Griffin', emoji: '🦁', baseStats: { health: 115, attack: 14, defense: 13 } }
];

module.exports = {
    name: 'pet-create',
    description: 'Crea una nueva mascota',
    aliases: ['newpet'],
    cooldown: 3600, // 1 hora entre creaciones
    async execute(message, args) {
        const petName = args.join(' ');
        if (!petName) {
            return message.reply('¡Necesitas darle un nombre a tu mascota!');
        }

        const randomType = petTypes[Math.floor(Math.random() * petTypes.length)];
        const pet = createPet(message.author.id, petName, randomType.name);

        const embed = createEmbed(
            '🎉 ¡Nueva Mascota!',
            `Has creado una nueva mascota:\n\n` +
            `**Nombre:** ${pet.name}\n` +
            `**Tipo:** ${randomType.emoji} ${pet.type}\n` +
            `**Nivel:** ${pet.level}\n` +
            `**Estadísticas:**\n` +
            `❤️ Salud: ${pet.health}\n` +
            `⚔️ Ataque: ${pet.attack}\n` +
            `🛡️ Defensa: ${pet.defense}\n\n` +
            `¡Usa \`!pet-train\` para entrenar a tu mascota!`
        );

        message.channel.send({ embeds: [embed] });
    },
};
