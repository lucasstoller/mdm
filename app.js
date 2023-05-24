require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log(OPENAI_API_KEY);

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
console.log(DISCORD_TOKEN);

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
];

const client = new Client({ intents });

client.once('ready', () => {
  console.log('Ready!');
});

const SUFFIX_CHARS_TO_REMOVE = 4

var messagesList = [{role: "system", name: "System", content: "Hello!"}];

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.mentions.has(client.user.id)) {
    const prompt = getMessageWithoutMentionId(message);
    const newMessage = {
      role: "user",
      name: getMessageAuthorId(message),
      content: prompt
    }
    messagesList = [
      ...messagesList,
      newMessage
    ]
    console.log(messagesList);
    
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messagesList
    });

    console.log("Response: " + completion.data.choices[0]);

    const chatGptResponse = completion.data.choices[0].message.content
    console.log("Response Content: " + completion.data.choices[0].content);
    messagesList = [
      ...messagesList,
      {role: "assistant", content: chatGptResponse, name: "MdM"}
    ] 
    
    message.channel.send(chatGptResponse);
  }
});

client.login(DISCORD_TOKEN);

function getMessageAuthorId(message) {
  const authorId = message.author.id;
  return authorId;
}

function getMessageWithoutMentionId(message) {
  const messageContent = message.content.slice(client.user.id.length + SUFFIX_CHARS_TO_REMOVE);
  return messageContent;
}