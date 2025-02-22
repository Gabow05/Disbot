const { createEmbed } = require('../../utils/embed.js');
const { getCraftingRecipes, getUser, getInventory } = require('../../utils/database.js');

module.exports = {
    name: 'craft',
    description: 'Craftea items usando materiales de tu inventario',
    aliases: ['crafting', 'crear'],
    cooldown: 5,
    async execute(message, args) {
        const subcommand = args[0]?.toLowerCase();
        const recipeId = args[1];

        // Mostrar recetas disponibles
        if (!subcommand || subcommand === 'list') {
            const recipes = getCraftingRecipes();
            
            const embed = createEmbed(
                '🛠️ Recetas de Crafteo',
                'Usa `!craft make <id>` para crear un item.\n\n' +
                recipes.map(recipe => {
                    const requirements = JSON.parse(recipe.required_items);
                    const quantities = JSON.parse(recipe.required_quantities);
                    
                    return `**${recipe.result_item_id}** (ID: \`${recipe.id}\`)\n` +
                        'Requiere:\n' +
                        requirements.map((item, index) => 
                            `- ${item} x${quantities[index]}`
                        ).join('\n');
                }).join('\n\n──────────\n\n')
            );

            return message.channel.send({ embeds: [embed] });
        }

        // Craftear un item
        if (subcommand === 'make' && recipeId) {
            const result = craftItem(message.author.id, recipeId);
            
            if (!result) {
                return message.reply('No tienes los materiales necesarios o la receta no existe.');
            }

            const embed = createEmbed(
                '✨ ¡Item Crafteado!',
                `Has crafteado exitosamente: **${result.item.name}**\n\n` +
                'Materiales utilizados:\n' +
                result.used_materials.map(m => `- ${m.name} x${m.quantity}`).join('\n')
            );

            return message.channel.send({ embeds: [embed] });
        }

        message.reply('Uso: `!craft list` o `!craft make <id>`');
    },
};
