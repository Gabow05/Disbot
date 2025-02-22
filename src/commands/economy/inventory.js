const { createEmbed } = require('../../utils/embed.js');
const { db } = require('../../utils/database.js');

module.exports = {
    name: 'inventory',
    description: 'Ver y usar items de tu inventario',
    aliases: ['inv', 'items'],
    cooldown: 5,
    async execute(message, args) {
        try {
            const userId = message.author.id;
            const subcommand = args[0]?.toLowerCase();
            const itemId = args[1]?.toLowerCase();
            const targetPet = args[2]?.toLowerCase();

            // Usar un item
            if (subcommand === 'use' && itemId) {
                const item = await db.query(
                    `SELECT i.*, s.effect, s.type
                    FROM inventory i
                    JOIN shop_items s ON i.item_id = s.id
                    WHERE i.user_id = $1 AND i.item_id = $2`,
                    [userId, itemId]
                );

                if (!item.rows[0] || item.rows[0].quantity < 1) {
                    return message.reply('No tienes este item en tu inventario.');
                }

                // Procesar efectos del item
                const itemData = item.rows[0];
                const [effectType, value] = itemData.effect.split(':');
                let result;

                // Comenzar transacción
                const client = await db.connect();
                try {
                    await client.query('BEGIN');

                    // Actualizar inventario
                    await client.query(
                        'UPDATE inventory SET quantity = quantity - 1 WHERE user_id = $1 AND item_id = $2',
                        [userId, itemId]
                    );

                    // Aplicar efecto según el tipo
                    switch (effectType) {
                        case 'heal':
                            await client.query(
                                'UPDATE pets SET health = health + $1 WHERE id = $2 AND user_id = $3',
                                [parseInt(value), targetPet, userId]
                            );
                            result = `Tu mascota ha recuperado ${value} puntos de salud.`;
                            break;
                        case 'attack':
                            await client.query(
                                'UPDATE pets SET attack = attack + $1 WHERE id = $2 AND user_id = $3',
                                [parseInt(value), targetPet, userId]
                            );
                            result = `El ataque de tu mascota ha aumentado en ${value} puntos.`;
                            break;
                        case 'defense':
                            await client.query(
                                'UPDATE pets SET defense = defense + $1 WHERE id = $2 AND user_id = $3',
                                [parseInt(value), targetPet, userId]
                            );
                            result = `La defensa de tu mascota ha aumentado en ${value} puntos.`;
                            break;
                        case 'exp':
                            await client.query(
                                'UPDATE pets SET exp = exp + $1 WHERE id = $2 AND user_id = $3',
                                [parseInt(value), targetPet, userId]
                            );
                            result = `Tu mascota ha ganado ${value} puntos de experiencia.`;
                            break;
                        default:
                            throw new Error('Tipo de item no válido');
                    }

                    await client.query('COMMIT');

                    const embed = createEmbed(
                        '✨ Item Usado',
                        `Has usado ${itemData.name}\n${result}`
                    );
                    return message.channel.send({ embeds: [embed] });
                } catch (error) {
                    await client.query('ROLLBACK');
                    throw error;
                } finally {
                    client.release();
                }
            }

            // Mostrar inventario
            const inventory = await db.query(
                `SELECT i.*, s.name, s.description, s.rarity, s.type
                FROM inventory i
                JOIN shop_items s ON i.item_id = s.id
                WHERE i.user_id = $1 AND i.quantity > 0`,
                [userId]
            );

            if (!inventory.rows.length) {
                return message.reply('Tu inventario está vacío. Usa `!shop` para comprar items.');
            }

            const rarityEmojis = {
                common: '⚪',
                uncommon: '🟢',
                rare: '🔵',
                epic: '🟣',
                legendary: '🟡'
            };

            const embed = createEmbed(
                '🎒 Tu Inventario',
                `Usa \`!inventory use <id> [mascota]\` para usar un item.\n\n` +
                inventory.rows.map(item => 
                    `${rarityEmojis[item.rarity]} **${item.name}** (ID: \`${item.item_id}\`) x${item.quantity}\n` +
                    `${item.description}\n` +
                    `Tipo: ${item.type}\n`
                ).join('\n──────────\n')
            );

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error en comando inventory:', error);
            message.reply('¡Hubo un error al acceder al inventario! Por favor, intenta nuevamente.');
        }
    },
};