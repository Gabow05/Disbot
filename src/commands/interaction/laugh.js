const { createEmbed } = require('../../utils/embed.js');
const { getGif } = require('../../utils/tenor.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'laugh',
    description: '😂 ¡Ríete a carcajadas!',
    aliases: ['reir', 'risa', 'lol'],
    cooldown: 3,
    slashCommand: true,
    options: new SlashCommandBuilder()
        .setName('laugh')
        .setDescription('¡Ríete a carcajadas!')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario que te hizo reír (opcional)')
                .setRequired(false)
        ),

    async execute(message, args) {
        const target = message.mentions.users.first();
        let description;

        const laughMessages = [
            "se ríe a carcajadas 😂",
            "no puede parar de reír 🤣",
            "está muriendo de risa 😆",
            "se parte de risa 😹",
            "está que explota de risa 🎭",
            "se ríe sin control 😅",
            "tiene un ataque de risa 😄",
            "se está riendo como nunca ✨"
        ];

        const targetMessages = [
            "se muere de risa por",
            "no puede parar de reírse gracias a",
            "tiene un ataque de risa por culpa de",
            "se ríe sin control por",
            "se divierte muchísimo con",
            "no puede contener la risa por",
            "está llorando de risa por",
            "se parte de risa con"
        ];

        const effects = [
            "¡JAJAJA! 😂",
            "¡HAHAHA! 🤣",
            "¡LOL! 😆",
            "¡JEJE! 😄",
            "¡PFFF! 😅",
            "¡AJAJÁ! ✨"
        ];

        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        const gifUrl = await getGif('anime laugh');

        if (target) {
            const randomTargetMessage = targetMessages[Math.floor(Math.random() * targetMessages.length)];
            description = `**${message.author}** ${randomTargetMessage} **${target}**\n${randomEffect}`;
        } else {
            const randomLaughMessage = laughMessages[Math.floor(Math.random() * laughMessages.length)];
            description = `**${message.author}** ${randomLaughMessage}\n${randomEffect}`;
        }

        const embed = createEmbed(
            '😂 ¡Tiempo de Risas!',
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

        const laughMessages = [
            "se ríe a carcajadas 😂",
            "no puede parar de reír 🤣",
            "está muriendo de risa 😆",
            "se parte de risa 😹",
            "está que explota de risa 🎭",
            "se ríe sin control 😅",
            "tiene un ataque de risa 😄",
            "se está riendo como nunca ✨"
        ];

        const targetMessages = [
            "se muere de risa por",
            "no puede parar de reírse gracias a",
            "tiene un ataque de risa por culpa de",
            "se ríe sin control por",
            "se divierte muchísimo con",
            "no puede contener la risa por",
            "está llorando de risa por",
            "se parte de risa con"
        ];

        const effects = [
            "¡JAJAJA! 😂",
            "¡HAHAHA! 🤣",
            "¡LOL! 😆",
            "¡JEJE! 😄",
            "¡PFFF! 😅",
            "¡AJAJÁ! ✨"
        ];

        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        const gifUrl = await getGif('anime laugh');

        if (target) {
            const randomTargetMessage = targetMessages[Math.floor(Math.random() * targetMessages.length)];
            description = `**${interaction.user}** ${randomTargetMessage} **${target}**\n${randomEffect}`;
        } else {
            const randomLaughMessage = laughMessages[Math.floor(Math.random() * laughMessages.length)];
            description = `**${interaction.user}** ${randomLaughMessage}\n${randomEffect}`;
        }

        const embed = createEmbed(
            '😂 ¡Tiempo de Risas!',
            description
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        await interaction.reply({ embeds: [embed] });
    }
};
