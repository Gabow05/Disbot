const { createEmbed } = require('../../utils/embed.js');
const { getShopItems, buyItem, getUser } = require('../../utils/database.js');

module.exports = {
    name: 'shop',
    description: 'Visita la tienda para comprar items',
    aliases: ['store', 'tienda'],
    cooldown: 5,
    async execute(message, args) {
        try {
            const userId = message.author.id;
            const subcommand = args[0]?.toLowerCase();
            const itemId = args[1]?.toLowerCase();
            const quantity = parseInt(args[2]) || 1;

            if (subcommand === 'buy' && itemId) {
                const user = await getUser(userId);
                const result = await buyItem(userId, itemId, quantity);

                if (!result) {
                    return message.reply('No tienes suficientes monedas o el item no está disponible.');
                }

                const embed = createEmbed(
                    '🛍️ ¡Compra Exitosa!',
                    `Has comprado ${quantity}x ${result.item.name}\n` +
                    `Costo total: ${result.cost} 🪙\n` +
                    `Balance restante: ${user.coins - result.cost} 🪙\n\n` +
                    `Usa \`!inventory\` para ver tus items.`
                );
                return message.channel.send({ embeds: [embed] });
            }

            // Mostrar tienda
            const rarityEmojis = {
                common: '⚪',
                uncommon: '🟢',
                rare: '🔵',
                epic: '🟣',
                legendary: '🟡'
            };

            const items = await getShopItems();
            const embed = createEmbed(
                '🏪 Tienda de Items',
                'Bienvenido a la tienda. Usa `!shop buy <id> [cantidad]` para comprar items.\n\n' +
                items.map(item => 
                    `${rarityEmojis[item.rarity]} **${item.name}** (ID: \`${item.id}\`)\n` +
                    `${item.description}\n` +
                    `Precio: ${item.price} 🪙\n` +
                    `Rareza: ${item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}\n`
                ).join('\n──────────\n')
            );

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error en comando shop:', error);
            message.reply('¡Hubo un error al acceder a la tienda! Por favor, intenta nuevamente.');
        }
    },
};