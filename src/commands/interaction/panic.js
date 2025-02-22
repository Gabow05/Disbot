const { createEmbed } = require('../../utils/embed.js');
const { getGif } = require('../../utils/tenor.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'panic',
    description: '😱 ¡Entra en pánico!',
    aliases: ['panico', 'nervous'],
    cooldown: 3,
    slashCommand: true,
    options: new SlashCommandBuilder()
        .setName('panic')
        .setDescription('¡Entra en pánico!')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario que te hizo entrar en pánico (opcional)')
                .setRequired(false)
        ),

    async execute(message, args) {
        const target = message.mentions.users.first();
        let description;

        const panicMessages = [
            "¡ENTRA EN PÁNICO TOTAL! 😱",
            "corre en círculos desesperadamente 💫",
            "no sabe qué hacer con tanto nerviosismo 😖",
            "sufre un colapso nervioso cómico 🌀",
            "entra en modo crisis existencial 🤯",
            "tiene un momento de pánico absoluto ⚡",
            "pierde completamente la calma 💥",
            "experimenta una crisis nerviosa graciosa 😵",
            "se congela del pánico 🥶",
            "entra en modo caos total 🌪️",
            "tiene un cortocircuito mental 🔌",
            "se vuelve un manojo de nervios 🎭"
        ];

        const targetMessages = [
            "entra en pánico por culpa de",
            "pierde la calma por",
            "sufre una crisis existencial gracias a",
            "se pone super nervioso por",
            "entra en modo pánico por",
            "colapsa cómicamente debido a",
            "pierde el control por culpa de",
            "sufre un ataque de nervios por",
            "se asusta dramáticamente por",
            "tiene un momento de crisis por",
            "se vuelve un manojo de nervios por",
            "entra en caos total por culpa de"
        ];

        const effects = [
            "¡AAAHHH! 😱",
            "¡SOCORRO! 💦",
            "¡HELP! 🆘",
            "¡PÁNICO! ⚡",
            "¡CRISIS! 💫",
            "¡AUXILIO! 😵",
            "¡CAOS! 🌪️",
            "¡AAACK! 💥",
            "¡MAMÁ! 😭",
            "¡SALVESE QUIEN PUEDA! 🏃‍♂️"
        ];

        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        const gifUrl = await getGif('anime panic');

        if (target) {
            const randomTargetMessage = targetMessages[Math.floor(Math.random() * targetMessages.length)];
            description = `**${message.author}** ${randomTargetMessage} **${target}**\n${randomEffect}`;
        } else {
            const randomPanicMessage = panicMessages[Math.floor(Math.random() * panicMessages.length)];
            description = `**${message.author}** ${randomPanicMessage}\n${randomEffect}`;
        }

        const embed = createEmbed(
            '😱 ¡PÁNICO!',
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

        const panicMessages = [
            "¡ENTRA EN PÁNICO TOTAL! 😱",
            "corre en círculos desesperadamente 💫",
            "no sabe qué hacer con tanto nerviosismo 😖",
            "sufre un colapso nervioso cómico 🌀",
            "entra en modo crisis existencial 🤯",
            "tiene un momento de pánico absoluto ⚡",
            "pierde completamente la calma 💥",
            "experimenta una crisis nerviosa graciosa 😵",
            "se congela del pánico 🥶",
            "entra en modo caos total 🌪️",
            "tiene un cortocircuito mental 🔌",
            "se vuelve un manojo de nervios 🎭"
        ];

        const targetMessages = [
            "entra en pánico por culpa de",
            "pierde la calma por",
            "sufre una crisis existencial gracias a",
            "se pone super nervioso por",
            "entra en modo pánico por",
            "colapsa cómicamente debido a",
            "pierde el control por culpa de",
            "sufre un ataque de nervios por",
            "se asusta dramáticamente por",
            "tiene un momento de crisis por",
            "se vuelve un manojo de nervios por",
            "entra en caos total por culpa de"
        ];

        const effects = [
            "¡AAAHHH! 😱",
            "¡SOCORRO! 💦",
            "¡HELP! 🆘",
            "¡PÁNICO! ⚡",
            "¡CRISIS! 💫",
            "¡AUXILIO! 😵",
            "¡CAOS! 🌪️",
            "¡AAACK! 💥",
            "¡MAMÁ! 😭",
            "¡SALVESE QUIEN PUEDA! 🏃‍♂️"
        ];

        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        const gifUrl = await getGif('anime panic');

        if (target) {
            const randomTargetMessage = targetMessages[Math.floor(Math.random() * targetMessages.length)];
            description = `**${interaction.user}** ${randomTargetMessage} **${target}**\n${randomEffect}`;
        } else {
            const randomPanicMessage = panicMessages[Math.floor(Math.random() * panicMessages.length)];
            description = `**${interaction.user}** ${randomPanicMessage}\n${randomEffect}`;
        }

        const embed = createEmbed(
            '😱 ¡PÁNICO!',
            description
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        await interaction.reply({ embeds: [embed] });
    }
};