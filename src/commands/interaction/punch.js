const { createEmbed } = require('../../utils/embed.js');
const { getGif } = require('../../utils/tenor.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'punch',
    description: '👊 ¡Da un puñetazo amistoso!',
    aliases: ['puñetazo', 'golpe'],
    cooldown: 3,
    slashCommand: true,
    options: new SlashCommandBuilder()
        .setName('punch')
        .setDescription('¡Da un puñetazo amistoso!')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario a quien dar el puñetazo')
                .setRequired(true)
        ),

    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('❌ ¡Menciona a alguien para darle un puñetazo!');
        }

        const punchMessages = [
            "da un puñetazo suave y juguetón a",
            "golpea cómicamente a",
            "le da un toque de artes marciales a",
            "lanza un golpe de superhéroe a",
            "da un puñetazo de caricatura a",
            "intenta imitar a un boxeador con",
            "practica sus movimientos de kung-fu con",
            "sorprende con un golpe de almohada a"
        ];

        const effects = [
            "¡POW! 👊",
            "¡WHAM! 💫",
            "¡BAM! 💥",
            "¡KAPOW! ⭐",
            "¡PUNCH! 🥊",
            "¡BOOM! 💪"
        ];

        const randomMessage = punchMessages[Math.floor(Math.random() * punchMessages.length)];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        const gifUrl = await getGif('anime punch funny');

        const embed = createEmbed(
            `${randomEffect} ¡Puñetazo Amistoso!`,
            `**${message.author}** ${randomMessage} **${target}**\n${randomEffect}`
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        message.channel.send({ embeds: [embed] });
    },

    async slashExecute(interaction) {
        const target = interaction.options.getUser('usuario');
        
        const punchMessages = [
            "da un puñetazo suave y juguetón a",
            "golpea cómicamente a",
            "le da un toque de artes marciales a",
            "lanza un golpe de superhéroe a",
            "da un puñetazo de caricatura a",
            "intenta imitar a un boxeador con",
            "practica sus movimientos de kung-fu con",
            "sorprende con un golpe de almohada a"
        ];

        const effects = [
            "¡POW! 👊",
            "¡WHAM! 💫",
            "¡BAM! 💥",
            "¡KAPOW! ⭐",
            "¡PUNCH! 🥊",
            "¡BOOM! 💪"
        ];

        const randomMessage = punchMessages[Math.floor(Math.random() * punchMessages.length)];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        const gifUrl = await getGif('anime punch funny');

        const embed = createEmbed(
            `${randomEffect} ¡Puñetazo Amistoso!`,
            `**${interaction.user}** ${randomMessage} **${target}**\n${randomEffect}`
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        await interaction.reply({ embeds: [embed] });
    }
};
