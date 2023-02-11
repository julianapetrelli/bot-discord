const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const { TOKEN, OPENAI_SECRET_KEY } = process.env;

const got = require('got');
const prompt = `Artist: Megadeth\n\nLyrics:\n`;

// import the command files
const fs = require('node:fs');
const path = require('node:path');

const CommandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(CommandsPath).filter(file => file.endsWith('.js'));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

for (const file of commandFiles) {
    const filePath = path.join(CommandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command)
    }
}

// Log our bot in using the token from https://discord.com/developers/applications
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(TOKEN);

// listen for slash commands
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

(async () => {
    const url = 'https://api.openai.com/v1/engines/davinci/completions';
    const params = {
      "prompt": prompt,
      "max_tokens": 160,
      "temperature": 0.7,
      "frequency_penalty": 0.5
    };
  
    const headers = {
      'Authorization': `Bearer ${OPENAI_SECRET_KEY}`,
    };
  
    try {
      const response = await got.post(url, { json: params, headers: headers }).json();
      output = `${prompt}${response.choices[0].text}`;
      console.log(output);
    } catch (err) {
      console.log(err);
    }
  })();