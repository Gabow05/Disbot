const { EmbedBuilder } = require('discord.js');
const { embedColor, errorColor } = require('../config.js');

module.exports = {
    createEmbed: (title, description, isError = false) => {
        return new EmbedBuilder()
            .setColor(isError ? errorColor : embedColor)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();
    }
};
