const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Railway requires SSL
});

async function testConnection() {
  try {
    const res = await pool.query('SELECT * from ids');
    console.log('✅ Connected successfully at:', res.rows[0].now);
    const rows = res.rows ;

    rows.forEach(row => {
      console.log(`Serial: ${row.serial}, ID: ${row.id}`);
    });
  } catch (err) {
    console.error('❌ Error connecting to database:', err.message);
  } finally {
    await pool.end();
  }
}


// Replace with your own token
const token = process.env.BOT_TOKEN;

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


bot.onText(/\/subscribe/, async (msg) => {
  const chatId = msg.chat.id;
  var subed = false;

  // Insert or ignore if already exists
  try {
    const res = await pool.query('SELECT * from ids');
    const rows = res.rows;
    for(const row of rows){
      if(Number(row.id) === chatId)
        subed = true;
    }

    if(subed){
      await bot.sendMessage(chatId, `⚠️ You already are subscribed!`);
    }
    else{
      await pool.query(
        'INSERT INTO ids (id) VALUES ($1)',
        [chatId]
      );
  
      await bot.sendMessage(
        chatId,
        `👋 Welcome! You've been subscribed to receive cafeteria menu updates.`
      );
    }
    
  } catch (err) {
    console.error('❌ Error saving chat ID:', err.message);
    await bot.sendMessage(chatId, `⚠️ Something went wrong. Please try again later.`);
  }
});


//testConnection();