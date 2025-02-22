const { createEmbed } = require('../../utils/embed.js');
const { getGif } = require('../../utils/tenor.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'slap',
    description: '👋 ¡Dale una bofetada juguetona a alguien!',
    aliases: ['cachetada', 'bofetada'],
    cooldown: 3,
    slashCommand: true,
    options: new SlashCommandBuilder()
        .setName('slap')
        .setDescription('¡Dale una bofetada juguetona a alguien!')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario a quien dar la bofetada')
                .setRequired(true)
        ),

    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('❌ ¡Menciona a alguien para darle una bofetada!');
        }

        const slapMessages = [
            "le da una bofetada juguetona a",
            "da un golpecito suave a",
            "cachetea cómicamente a",
            "le da un correctivo amistoso a",
            "sorprende con una palmada a"
        ];

        const effects = [
            "¡PLAF! 👋",
            "¡PAF! 🖐️",
            "¡SLAP! ✋",
            "¡BOOM! 💥",
            "¡POW! 🤚"
        ];

        const randomMessage = slapMessages[Math.floor(Math.random() * slapMessages.length)];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        const gifUrl = await getGif('anime slap');

        const embed = createEmbed(
            `${randomEffect} ¡Bofetada!`,
            `**${message.author}** ${randomMessage} **${target}**\n${randomEffect}`
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        message.channel.send({ embeds: [embed] });
    },

    async slashExecute(interaction) {
        const target = interaction.options.getUser('usuario');
        
        const slapMessages = [
            "le da una bofetada juguetona a",
            "da un golpecito suave a",
            "cachetea cómicamente a",
            "le da un correctivo amistoso a",
            "sorprende con una palmada a"
        ];

        const effects = [
            "¡PLAF! 👋",
            "¡PAF! 🖐️",
            "¡SLAP! ✋",
            "¡BOOM! 💥",
            "¡POW! 🤚"
        ];

        const randomMessage = slapMessages[Math.floor(Math.random() * slapMessages.length)];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        const gifUrl = await getGif('anime slap');

        const embed = createEmbed(
            `${randomEffect} ¡Bofetada!`,
            `**${interaction.user}** ${randomMessage} **${target}**\n${randomEffect}`
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        await interaction.reply({ embeds: [embed] });
    }
};
