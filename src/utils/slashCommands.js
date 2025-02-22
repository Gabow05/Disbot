const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { token } = require('../config.js');

const rest = new REST({ version: '10' }).setToken(token);

async function registerSlashCommands(commands, clientId) {
    try {
        console.log('Comenzando el registro de comandos de barra (/)');

        // Filtrar y transformar comandos que tienen la propiedad slashCommand
        const slashCommands = commands
            .filter(cmd => cmd.slashCommand)
            .map(cmd => ({
                name: cmd.name,
                description: cmd.description,
                options: cmd.options?.options || [],
                default_member_permissions: cmd.permissions
            }));

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: slashCommands },
        );

        console.log('Comandos de barra (/) registrados exitosamente');
    } catch (error) {
        console.error('Error al registrar los comandos de barra:', error);
    }
}

module.exports = {
    registerSlashCommands
};