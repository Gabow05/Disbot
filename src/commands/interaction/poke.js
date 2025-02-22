const { createEmbed } = require('../../utils/embed.js');
const { getGif } = require('../../utils/tenor.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'poke',
    description: '👉 ¡Toca a alguien de forma juguetona!',
    aliases: ['tocar', 'molestar'],
    cooldown: 3,
    // Configuración para comando de barra
    slashCommand: true,
    options: new SlashCommandBuilder()
        .setName('poke')
        .setDescription('¡Toca a alguien de forma juguetona!')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario a quien quieres tocar')
                .setRequired(true)
        ),

    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('❌ ¡Menciona a alguien para tocar!');
        }

        const pokeMessages = [
            "toca juguetonamente a",
            "molesta pícaramente a",
            "da un toquecito travieso a",
            "llama la atención de",
            "intenta hacer reír a"
        ];

        const emojis = ['👉', '😋', '😝', '🤭', '😏'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const randomMessage = pokeMessages[Math.floor(Math.random() * pokeMessages.length)];
        const gifUrl = await getGif('anime poke');

        const embed = createEmbed(
            `${randomEmoji} ¡Toque Juguetón!`,
            `**${message.author}** ${randomMessage} **${target}** ${randomEmoji}`
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        message.channel.send({ embeds: [embed] });
    },

    async slashExecute(interaction) {
        const target = interaction.options.getUser('usuario');
        
        const pokeMessages = [
            "toca juguetonamente a",
            "molesta pícaramente a",
            "da un toquecito travieso a",
            "llama la atención de",
            "intenta hacer reír a"
        ];

        const emojis = ['👉', '😋', '😝', '🤭', '😏'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const randomMessage = pokeMessages[Math.floor(Math.random() * pokeMessages.length)];
        const gifUrl = await getGif('anime poke');

        const embed = createEmbed(
            `${randomEmoji} ¡Toque Juguetón!`,
            `**${interaction.user}** ${randomMessage} **${target}** ${randomEmoji}`
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        await interaction.reply({ embeds: [embed] });
    }
};
