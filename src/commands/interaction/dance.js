const { createEmbed } = require('../../utils/embed.js');
const { getGif } = require('../../utils/tenor.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'dance',
    description: '💃 ¡Baila solo o con alguien más!',
    aliases: ['bailar', 'baile'],
    cooldown: 3,
    slashCommand: true,
    options: new SlashCommandBuilder()
        .setName('dance')
        .setDescription('¡Baila solo o con alguien más!')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario con quien bailar (opcional)')
                .setRequired(false)
        ),

    async execute(message, args) {
        const target = message.mentions.users.first();
        const soloMessages = [
            "¡se pone a bailar con mucho ritmo! 🎵",
            "¡inicia un baile increíble! 🕺",
            "¡demuestra sus mejores pasos de baile! ✨",
            "¡se mueve al ritmo de la música! 🎶",
            "¡improvisa una coreografía espectacular! 🌟",
            "¡baila como si nadie estuviera mirando! 💫",
            "¡se convierte en el alma de la fiesta! 🎊",
            "¡demuestra sus movimientos más locos! 🌈",
            "¡hace un baile digno de TikTok! 📱",
            "¡mueve el esqueleto con estilo! 💃"
        ];

        const duoMessages = [
            "invita a bailar a",
            "comparte un baile especial con",
            "se mueve al ritmo con",
            "organiza una fiesta de baile con",
            "demuestra sus pasos de baile junto a",
            "crea una coreografía increíble con",
            "baila una pieza perfecta con",
            "comparte un momento musical con",
            "hace un dueto espectacular con",
            "inicia un flashmob con"
        ];

        const musicEmojis = ['💃', '🕺', '🎵', '🎶', '🎊', '✨', '🌟', '🎭', '🎪', '🎨'];
        const randomEmoji = musicEmojis[Math.floor(Math.random() * musicEmojis.length)];

        let description;
        let gifSearch = 'anime dance';

        if (target) {
            const randomDuoMessage = duoMessages[Math.floor(Math.random() * duoMessages.length)];
            description = `**${message.author}** ${randomDuoMessage} **${target}** ${randomEmoji}`;
            gifSearch = 'anime dance together';
        } else {
            const randomSoloMessage = soloMessages[Math.floor(Math.random() * soloMessages.length)];
            description = `**${message.author}** ${randomSoloMessage}`;
        }

        const gifUrl = await getGif(gifSearch);
        const embed = createEmbed(
            `${randomEmoji} ¡Tiempo de Baile!`,
            description
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        message.channel.send({ embeds: [embed] });
    },

    async slashExecute(interaction) {
        const target = interaction.options.getUser('usuario');

        const soloMessages = [
            "¡se pone a bailar con mucho ritmo! 🎵",
            "¡inicia un baile increíble! 🕺",
            "¡demuestra sus mejores pasos de baile! ✨",
            "¡se mueve al ritmo de la música! 🎶",
            "¡improvisa una coreografía espectacular! 🌟",
            "¡baila como si nadie estuviera mirando! 💫",
            "¡se convierte en el alma de la fiesta! 🎊",
            "¡demuestra sus movimientos más locos! 🌈",
            "¡hace un baile digno de TikTok! 📱",
            "¡mueve el esqueleto con estilo! 💃"
        ];

        const duoMessages = [
            "invita a bailar a",
            "comparte un baile especial con",
            "se mueve al ritmo con",
            "organiza una fiesta de baile con",
            "demuestra sus pasos de baile junto a",
            "crea una coreografía increíble con",
            "baila una pieza perfecta con",
            "comparte un momento musical con",
            "hace un dueto espectacular con",
            "inicia un flashmob con"
        ];

        const musicEmojis = ['💃', '🕺', '🎵', '🎶', '🎊', '✨', '🌟', '🎭', '🎪', '🎨'];
        const randomEmoji = musicEmojis[Math.floor(Math.random() * musicEmojis.length)];

        let description;
        let gifSearch = 'anime dance';

        if (target) {
            const randomDuoMessage = duoMessages[Math.floor(Math.random() * duoMessages.length)];
            description = `**${interaction.user}** ${randomDuoMessage} **${target}** ${randomEmoji}`;
            gifSearch = 'anime dance together';
        } else {
            const randomSoloMessage = soloMessages[Math.floor(Math.random() * soloMessages.length)];
            description = `**${interaction.user}** ${randomSoloMessage}`;
        }

        const gifUrl = await getGif(gifSearch);
        const embed = createEmbed(
            `${randomEmoji} ¡Tiempo de Baile!`,
            description
        );

        if (gifUrl) {
            embed.setImage(gifUrl);
        }

        await interaction.reply({ embeds: [embed] });
    }
};