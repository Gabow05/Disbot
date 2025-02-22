const { PermissionsBitField } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { checkPermissions } = require('../../utils/permissions.js');

module.exports = {
    name: 'kick',
    description: 'Kick a member from the server',
    aliases: ['k'],
    cooldown: 5,
    async execute(message, args) {
        if (!checkPermissions(message, PermissionsBitField.Flags.KickMembers)) return;

        const member = message.mentions.members.first();
        if (!member) {
            return message.reply('Please mention a member to kick!');
        }

        if (!member.kickable) {
            return message.reply('I cannot kick this user!');
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';

        try {
            await member.kick(reason);
            const embed = createEmbed('Member Kicked', `${member.user.tag} has been kicked\nReason: ${reason}`);
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            message.reply('There was an error trying to kick the member!');
        }
    },
};
