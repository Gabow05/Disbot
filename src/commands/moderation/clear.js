const { PermissionsBitField } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { checkPermissions } = require('../../utils/permissions.js');

module.exports = {
    name: 'clear',
    description: 'Clear messages from the channel',
    aliases: ['purge'],
    cooldown: 3,
    async execute(message, args) {
        if (!checkPermissions(message, PermissionsBitField.Flags.ManageMessages)) return;

        const amount = parseInt(args[0]) || 5;
        if (amount < 1 || amount > 100) {
            return message.reply('You need to specify a number between 1 and 100!');
        }

        try {
            const deleted = await message.channel.bulkDelete(amount, true);
            const embed = createEmbed('Messages Cleared', `Successfully deleted ${deleted.size} messages`);
            message.channel.send({ embeds: [embed] }).then(msg => {
                setTimeout(() => msg.delete(), 5000);
            });
        } catch (error) {
            message.reply('There was an error trying to clear messages!');
        }
    },
};
