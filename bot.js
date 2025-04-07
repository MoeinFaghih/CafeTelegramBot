const TelegramBot = require('node-telegram-bot-api');

// Replace with your own token
const token = '7838439395:AAFqV9sc4vi0-JB_x2tj1dJ0AU3BZaTLG48';

// Polling mode: Bot will constantly check for new messages
const bot = new TelegramBot(token, { polling: true });

// Listen for any kind of message
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   const text = msg.text;

//   console.log(`Received message from ${chatId}: ${text}`);

//   // Reply to the message
//   //bot.sendMessage(chatId, `You said: "${text}"`);
// });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'there';

  const welcomeText = `👋 Hello ${firstName}!\n\nThis bot helps you receive daily meal updates.\n\nTo subscribe, type /subscribe 🍽️`;

  bot.sendMessage(chatId, welcomeText);
});
