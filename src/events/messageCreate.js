const { addExperience } = require('../utils/levels.js');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        // Ignorar mensajes de bots y comandos
        if (message.author.bot || message.content.startsWith('!')) return;

        // Añadir experiencia por mensaje
        await addExperience(message);
    }
};
