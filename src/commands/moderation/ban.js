const { PermissionsBitField } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { checkPermissions } = require('../../utils/permissions.js');

module.exports = {
    name: 'ban',
    description: 'Ban a member from the server',
    aliases: ['b'],
    cooldown: 5,
    async execute(message, args) {
        if (!checkPermissions(message, PermissionsBitField.Flags.BanMembers)) return;

        const member = message.mentions.members.first();
        if (!member) {
            return message.reply('Please mention a member to ban!');
        }

        if (!member.bannable) {
            return message.reply('I cannot ban this user!');
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';

        try {
            await member.ban({ reason });
            const embed = createEmbed('Member Banned', `${member.user.tag} has been banned\nReason: ${reason}`);
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            message.reply('There was an error trying to ban the member!');
        }
    },
};
