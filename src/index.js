const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const { token, prefix } = require('./config.js');
const { registerSlashCommands } = require('./utils/slashCommands.js');

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
        console.log(`Loading command: ${command.name} from ${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log('Loaded commands:', Array.from(client.commands.keys()).join(', '));
    client.user.setActivity(`${prefix}help o ${prefix}ayuda`, { type: 'WATCHING' });

    // Registrar comandos de barra
    try {
        await registerSlashCommands(Array.from(client.commands.values()), client.user.id);
        console.log('Slash commands registered successfully');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
});

// Manejar comandos de barra
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        if (command.slashExecute) {
            await command.slashExecute(interaction);
        } else {
            await interaction.reply({ content: 'Este comando solo está disponible usando el prefijo !', ephemeral: true });
        }
    } catch (error) {
        console.error('Error executing slash command:', error);
        await interaction.reply({ 
            content: 'Hubo un error al ejecutar este comando.', 
            ephemeral: true 
        });
    }
});

// Manejar comandos con prefijo
client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) 
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    // Cooldown check
    if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Por favor espera ${timeLeft.toFixed(1)} segundos más antes de usar el comando \`${command.name}\`.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error('Error executing command:', command.name);
        console.error(error);
        message.reply('¡Hubo un error al ejecutar el comando!');
    }
});

client.login(token);