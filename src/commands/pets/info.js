const { createEmbed } = require('../../utils/embed.js');
const { getUserPets } = require('../../utils/database.js');

module.exports = {
    name: 'pet-info',
    description: 'Ver información de tus mascotas',
    aliases: ['pets'],
    cooldown: 5,
    async execute(message, args) {
        const pets = getUserPets(message.author.id);
        
        if (!pets.length) {
            return message.reply('¡No tienes mascotas! Usa `!pet-create [nombre]` para crear una.');
        }

        const petEmojis = {
            'Dragon': '🐲',
            'Phoenix': '🦅',
            'Unicorn': '🦄',
            'Griffin': '🦁'
        };

        const embed = createEmbed(
            '🐾 Tus Mascotas',
            pets.map(pet => 
                `**${pet.name}** ${petEmojis[pet.type]}\n` +
                `Tipo: ${pet.type}\n` +
                `Nivel: ${pet.level} (EXP: ${pet.exp})\n` +
                `❤️ Salud: ${pet.health}\n` +
                `⚔️ Ataque: ${pet.attack}\n` +
                `🛡️ Defensa: ${pet.defense}\n` +
                `Último entrenamiento: ${pet.last_training ? new Date(pet.last_training).toLocaleString() : 'Nunca'}\n`
            ).join('\n──────────\n')
        );

        message.channel.send({ embeds: [embed] });
    },
};
