const { PermissionsBitField } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { checkPermissions } = require('../../utils/permissions.js');

module.exports = {
    name: 'timeout',
    description: 'Timeout a member',
    aliases: ['mute'],
    cooldown: 5,
    async execute(message, args) {
        if (!checkPermissions(message, PermissionsBitField.Flags.ModerateMembers)) return;

        const member = message.mentions.members.first();
        if (!member) {
            return message.reply('Please mention a member to timeout!');
        }

        const duration = parseInt(args[1]) || 5;
        const durationMs = duration * 60 * 1000; // Convert to milliseconds

        try {
            await member.timeout(durationMs);
            const embed = createEmbed('Member Timed Out', `${member.user.tag} has been timed out for ${duration} minutes`);
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            message.reply('There was an error trying to timeout the member!');
        }
    },
};
