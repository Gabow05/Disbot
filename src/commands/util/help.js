const { createEmbed } = require('../../utils/embed.js');

module.exports = {
    name: 'help',
    description: 'Muestra todos los comandos disponibles',
    aliases: ['h', 'comandos'],
    cooldown: 5,
    execute(message, args) {
        const commands = message.client.commands;
        const categories = new Map();

        // Organizar comandos por categorías
        commands.forEach(command => {
            const category = command.category || 'Otros';
            if (!categories.has(category)) {
                categories.set(category, []);
            }
            categories.get(category).push(command);
        });

        const helpEmbed = createEmbed(
            '📚 Comandos Disponibles',
            'Aquí tienes una lista de todos los comandos disponibles:'
        );

        // Emoji para cada categoría
        const categoryEmojis = {
            'moderation': '🛡️',
            'economy': '💰',
            'games': '🎮',
            'interaction': '🤗',
            'pets': '🐾',
            'util': '🔧'
        };

        // Agregar campos para cada categoría
        for (const [category, cmds] of categories) {
            const emoji = categoryEmojis[category.toLowerCase()] || '📌';
            const commandList = cmds.map(cmd => {
                const aliases = cmd.aliases ? ` (${cmd.aliases.join(', ')})` : '';
                return `\`!${cmd.name}\`${aliases}: ${cmd.description}`;
            }).join('\n');

            helpEmbed.addFields({
                name: `${emoji} ${category}`,
                value: commandList || 'No hay comandos disponibles',
                inline: false
            });
        }

        helpEmbed.setFooter({ 
            text: 'Usa !help <comando> para más información sobre un comando específico' 
        });

        message.channel.send({ embeds: [helpEmbed] });
    },
};
