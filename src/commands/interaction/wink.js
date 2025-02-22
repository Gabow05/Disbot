const { createEmbed } = require('../../utils/embed.js');
const { getGif } = require('../../utils/tenor.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'wink',
    description: '😉 ¡Guiña el ojo de forma coqueta!',
    aliases: ['guiñar', 'guiño'],
    cooldown: 3,
    slashCommand: true,
    options: new SlashCommandBuilder()
        .setName('wink')
        .setDescription('¡Guiña el ojo de forma coqueta!')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario a quien guiñar el ojo')
                .setRequired(false)
        ),

    async execute(message, args) {
        const target = message.mentions.users.first();
        let description;

        const winkMessages = [
            "guiña el ojo con picardía 😉",
            "hace un guiño travieso ✨",
            "guiña el ojo de forma juguetona 💫",
            "lanza un guiño coqueto 🌟",
            "guiña el ojo con complicidad 😊",
            "hace un guiño amistoso 💝",
            "envía un guiño divertido 🎀",
            "guiña el ojo con gracia ⭐"
        ];

        const targetMessages = [
            "guiña el ojo coquetamente a",
            "lanza un guiño travieso a",
            "hace un guiño juguetón a",
            "envía un guiño especial a",
            "guiña el ojo con picardía a",
            "comparte un guiño cómplice con",
            "hace un guiño amistoso a",
            "guiña el ojo de forma divertida a"
        ];

        const gifUrl = await getGif('anime wink');

        if (target) {
            const randomTargetMessage = targetMessages[Math.floor(Math.random() * targetMessages.length)];
            description = `**${message.author}** ${randomTargetMessage} **${target}** 😉`;
        } else {
            const randomWinkMessage = winkMessages[Math.floor(Math.random() * winkMessages.length)];
            description = `**${message.author}** ${randomWinkMessage}`;
        }

        const embed = createEmbed(
            '😉 ¡Guiño Juguetón!',
            description
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        message.channel.send({ embeds: [embed] });
    },

    async slashExecute(interaction) {
        const target = interaction.options.getUser('usuario');
        let description;

        const winkMessages = [
            "guiña el ojo con picardía 😉",
            "hace un guiño travieso ✨",
            "guiña el ojo de forma juguetona 💫",
            "lanza un guiño coqueto 🌟",
            "guiña el ojo con complicidad 😊",
            "hace un guiño amistoso 💝",
            "envía un guiño divertido 🎀",
            "guiña el ojo con gracia ⭐"
        ];

        const targetMessages = [
            "guiña el ojo coquetamente a",
            "lanza un guiño travieso a",
            "hace un guiño juguetón a",
            "envía un guiño especial a",
            "guiña el ojo con picardía a",
            "comparte un guiño cómplice con",
            "hace un guiño amistoso a",
            "guiña el ojo de forma divertida a"
        ];

        const gifUrl = await getGif('anime wink');

        if (target) {
            const randomTargetMessage = targetMessages[Math.floor(Math.random() * targetMessages.length)];
            description = `**${interaction.user}** ${randomTargetMessage} **${target}** 😉`;
        } else {
            const randomWinkMessage = winkMessages[Math.floor(Math.random() * winkMessages.length)];
            description = `**${interaction.user}** ${randomWinkMessage}`;
        }

        const embed = createEmbed(
            '😉 ¡Guiño Juguetón!',
            description
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        await interaction.reply({ embeds: [embed] });
    }
};
