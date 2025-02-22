const { createEmbed } = require('../../utils/embed.js');
const { getActiveEvents, participateInEvent } = require('../../utils/database.js');

module.exports = {
    name: 'events',
    description: 'Ver y participar en eventos especiales',
    aliases: ['evento', 'special'],
    cooldown: 5,
    async execute(message, args) {
        const subcommand = args[0]?.toLowerCase();
        const eventId = args[1];

        // Mostrar eventos activos
        if (!subcommand || subcommand === 'list') {
            const events = getActiveEvents();
            
            if (!events.length) {
                return message.reply('No hay eventos activos en este momento.');
            }

            const embed = createEmbed(
                '🎉 Eventos Especiales',
                'Eventos activos actualmente:\n\n' +
                events.map(event => 
                    `**${event.name}** (ID: \`${event.id}\`)\n` +
                    `${event.description}\n` +
                    `⏰ Termina: ${new Date(event.end_date).toLocaleString()}\n` +
                    `🎁 Recompensas: ${event.rewards}\n` +
                    `📋 Requisitos: ${event.requirements}`
                ).join('\n\n──────────\n\n') +
                '\nUsa `!events join <id>` para participar en un evento.'
            );

            return message.channel.send({ embeds: [embed] });
        }

        // Participar en un evento
        if (subcommand === 'join' && eventId) {
            const result = participateInEvent(message.author.id, eventId);
            
            if (!result) {
                return message.reply('No se pudo unir al evento. Verifica que el evento esté activo y cumplas los requisitos.');
            }

            const embed = createEmbed(
                '✨ ¡Te has unido al evento!',
                `Has comenzado a participar en: **${result.event.name}**\n\n` +
                `Objetivo: ${result.event.description}\n` +
                `Recompensa al completar: ${result.event.rewards}`
            );

            return message.channel.send({ embeds: [embed] });
        }

        message.reply('Uso: `!events list` o `!events join <id>`');
    },
};
