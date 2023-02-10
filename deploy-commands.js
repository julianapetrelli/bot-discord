const { REST, Routes } = require('discord.js');

const dotenv = require('dotenv');
dotenv.config();

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const fs = require('node:fs');
const path = require('node:path');

const CommandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(CommandsPath).filter(file => file.endsWith('.js'));

const commands = [];

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    commands.push(command.data.toJSON())
}

// instantiate a new REST object
const rest = new REST({ version: '10' }).setToken(TOKEN);

// deploy the commands
(async () => {
    try {
        // PUT
        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        )
    }
    catch (error) {
        console.error(error)
    }
})()