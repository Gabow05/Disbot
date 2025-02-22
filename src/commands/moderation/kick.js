const { PermissionsBitField } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { checkPermissions } = require('../../utils/permissions.js');

module.exports = {
    name: 'kick',
    description: 'Expulsa a un miembro del servidor',
    aliases: ['k'],
    category: 'Moderación',
    cooldown: 5,
    async execute(message, args) {
        if (!checkPermissions(message, PermissionsBitField.Flags.KickMembers)) return;

        const member = message.mentions.members.first();
        if (!member) {
            return message.reply('¡Por favor menciona a un miembro para expulsar!');
        }

        if (!member.kickable) {
            return message.reply('¡No puedo expulsar a este usuario!');
        }

        const reason = args.slice(1).join(' ') || 'No se proporcionó razón';

        try {
            await member.kick(reason);
            const embed = createEmbed('Miembro Expulsado', `${member.user.tag} ha sido expulsado\nRazón: ${reason}`);
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            message.reply('¡Hubo un error al intentar expulsar al miembro!');
        }
    },
};