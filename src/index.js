const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const { prefix } = require('./config.js'); // Eliminamos el token del archivo de config.js
const { registerSlashCommands } = require('./utils/slashCommands.js');
const { startMonitoring } = require('./utils/monitoring.js');

// Cargar token desde variables de entorno
const token = process.env.TOKEN;

// Verificar si el token está cargado
console.log("🔍 Token cargado:", token ? "Sí" : "No");

if (!token) {
    console.error("❌ ERROR: No se encontró el token. Verifica las variables de entorno en Render.");
    process.exit(1);
}

// Iniciar servidor de monitoreo primero
startMonitoring().then(() => {
    console.log('✅ Monitoring server started successfully');
    startBot();
}).catch(error => {
    console.error('❌ Failed to start monitoring server:', error);
    process.exit(1);
});

function startBot() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers
        ]
    });

    client.commands = new Collection();
    client.cooldowns = new Collection();

    // Cargar comandos
    const commandFolders = fs.readdirSync('./src/commands');

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${folder}/${file}`);
            console.log(`📂 Loading command: ${command.name} from ${folder}/${file}`);
            client.commands.set(command.name, command);
        }
    }

    client.once('ready', async () => {
        console.log(`✅ Logged in as ${client.user.tag}!`);
        console.log('📜 Loaded commands:', Array.from(client.commands.keys()).join(', '));
        client.user.setActivity(`${prefix}help o ${prefix}ayuda`, { type: 'WATCHING' });

        // Registrar comandos de barra
        try {
            await registerSlashCommands(Array.from(client.commands.values()), client.user.id);
            console.log('✅ Slash commands registered successfully');
        } catch (error) {
            console.error('❌ Error registering slash commands:', error);
        }
    });

    client.on('messageCreate', async message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) 
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error('❌ Error executing command:', command.name);
            console.error(error);
            message.reply('⚠️ ¡Hubo un error al ejecutar el comando!');
        }
    });

    // Manejar errores y reconexiones
    client.on('error', error => console.error('❌ Discord client error:', error));
    client.on('disconnect', () => console.log('⚠️ Bot disconnected! Attempting to reconnect...'));

    // Intentar iniciar sesión con reintentos
    function loginWithRetry(retries = 5, delay = 5000) {
        client.login(token).catch(error => {
            console.error('❌ Failed to login:', error);
            if (retries > 0) {
                console.log(`🔄 Retrying login in ${delay / 1000} seconds... (${retries} attempts remaining)`);
                setTimeout(() => loginWithRetry(retries - 1, delay), delay);
            } else {
                console.error('❌ Max login retries reached. Please check your token and internet connection.');
                process.exit(1);
            }
        });
    }

    loginWithRetry();
}

// Manejar errores no capturados
process.on('uncaughtException', error => console.error('❌ Uncaught Exception:', error));
process.on('unhandledRejection', error => console.error('❌ Unhandled Rejection:', error));

// 🚀 Servidor Express para mantener activo en Render
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('✅ ¡El bot está funcionando y activo en Render!');
});

// Escuchar en el puerto asignado por Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌍 Servidor web activo en el puerto ${PORT}`);
});
