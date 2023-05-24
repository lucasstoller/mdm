require('dotenv').config();
const Discord = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const intents = [
  Discord.Intents.FLAGS.GUILDS,
  Discord.Intents.FLAGS.GUILD_MESSAGES,
];

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILDS_MESSAGES] });


client.once('ready', () => {
  console.log('Ready!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith('!ai')) {
    const prompt = message.content.slice(4);
    const completion = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: prompt,
    });
    message.channel.send(completion.data.choices[0].text);
  }
});

client.login(process.env.DISCORD_TOKEN);