const { createEmbed } = require('../../utils/embed.js');

module.exports = {
    name: 'help',
    description: '📚 Muestra todos los comandos disponibles del bot',
    aliases: ['h', 'comandos', 'ayuda'],
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

        // Si se especifica un comando, mostrar ayuda detallada
        if (args.length > 0) {
            const commandName = args[0].toLowerCase();
            const command = commands.get(commandName) ||
                commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (!command) {
                return message.reply('❌ No encontré ese comando. Usa `!help` para ver todos los comandos disponibles.');
            }

            const embed = createEmbed(
                `📖 Ayuda: ${command.name}`,
                `**${command.description}**\n\n` +
                (command.aliases ? `✨ **Aliases:** ${command.aliases.join(', ')}\n` : '') +
                (command.usage ? `📝 **Uso:** ${command.usage}\n` : '') +
                `⏰ **Cooldown:** ${command.cooldown || 3} segundos`
            );

            return message.channel.send({ embeds: [embed] });
        }

        // Emoji para cada categoría
        const categoryEmojis = {
            'Moderación': '🛡️',
            'Economía': '💰',
            'Juegos': '🎮',
            'Interacción': '🤗',
            'Mascotas': '🐾',
            'Utilidad': '🔧'
        };

        const helpEmbed = createEmbed(
            '✨ Comandos Disponibles',
            '¡Bienvenido al sistema de ayuda!\n\n' +
            '📌 Usa `!help <comando>` para más información sobre un comando específico.\n' +
            '🎮 Todos los comandos empiezan con el prefijo `!`\n\n' +
            '👨‍💻 **Bot creado por Gabow**\n' +
            '🌟 Sistema de mascotas, economía y diversión'
        );

        // Agregar campos para cada categoría
        for (const [category, cmds] of categories) {
            const emoji = categoryEmojis[category] || '📌';
            const commandList = cmds
                .map(cmd => {
                    const aliases = cmd.aliases ? ` *(${cmd.aliases.join(', ')})*` : '';
                    return `> \`${cmd.name}\`${aliases}\n> ${cmd.description}`;
                })
                .slice(0, 10) // Limitar a 10 comandos por categoría
                .join('\n\n');

            if (commandList) {
                helpEmbed.addFields({
                    name: `${emoji} ${category}`,
                    value: commandList,
                    inline: false
                });
            }
        }

        // Agregar pie de página
        helpEmbed.setFooter({ 
            text: '¡Gracias por usar el bot! - Creado por Gabow'
        });

        message.channel.send({ embeds: [helpEmbed] });
    },
};