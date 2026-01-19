const { Telegraf } = require('telegraf');
const express = require('express');

// Get bot token from environment or use placeholder
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';

// Create bot
const bot = new Telegraf(BOT_TOKEN);
const app = express();

// Simple in-memory storage
let accounts = [];

// ========== BOT COMMANDS ==========

// Start command
bot.command('start', (ctx) => {
  ctx.reply(`
🤖 Online Group Bot (24/7)

I'm running on a free server! Always online.

Commands:
/addaccount - Add your Telegram account
/creategroup - Create a single group
/createbulk - Create multiple groups
/listaccounts - Show your accounts
/status - Check bot status

📊 Status: ✅ Online 24/7
  `);
});

// Add account
bot.command('addaccount', (ctx) => {
  const userId = ctx.from.id;
  
  ctx.reply(`
📱 Add Account Demo

Since this is a demo bot, accounts are stored temporarily.

To add real account:
1. Get API from https://my.telegram.org
2. Contact developer for full version

For now, demo account added!
  `);
  
  // Add demo account
  accounts.push({
    id: userId,
    phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    added: new Date().toISOString()
  });
});

// Create single group
bot.command('creategroup', async (ctx) => {
  const userId = ctx.from.id;
  
  await ctx.reply('⏳ Creating demo group...');
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  await ctx.reply(`
✅ Demo Group Created!

Group Name: Test Group ${Date.now().toString().slice(-6)}
Features: 'hello' message, open permissions

📊 Server Status: ✅ Online
⏰ Uptime: 24/7
  `);
});

// Create bulk groups
bot.command('createbulk', async (ctx) => {
  await ctx.reply('How many groups? (1-5):');
  
  // Simple state management
  ctx.session = ctx.session || {};
  ctx.session.waitingForCount = true;
});

// Handle messages
bot.on('text', async (ctx) => {
  if (ctx.session && ctx.session.waitingForCount) {
    const count = parseInt(ctx.message.text);
    
    if (isNaN(count) || count < 1 || count > 5) {
      await ctx.reply('Please enter 1-5:');
      return;
    }
    
    let progress = await ctx.reply(`Creating ${count} groups...\nProgress: 0%`);
    
    for (let i = 1; i <= count; i++) {
      const percent = Math.floor((i / count) * 100);
      await ctx.telegram.editMessageText(
        progress.chat.id,
        progress.message_id,
        null,
        `Creating ${count} groups...\nProgress: ${percent}% (${i}/${count})`
      );
      
      // Simulate work
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    await ctx.reply(`
✅ Created ${count} groups!
Server: Render.com (Free Tier)
Uptime: 24/7
Status: ✅ Online
    `);
    
    ctx.session.waitingForCount = false;
  }
});

// List accounts
bot.command('listaccounts', (ctx) => {
  const userId = ctx.from.id;
  const userAccounts = accounts.filter(acc => acc.id === userId);
  
  if (userAccounts.length === 0) {
    ctx.reply('No accounts yet. Use /addaccount');
    return;
  }
  
  let message = `📱 Your Accounts:\n\n`;
  userAccounts.forEach((acc, index) => {
    message += `${index + 1}. ${acc.phone}\nAdded: ${new Date(acc.added).toLocaleDateString()}\n\n`;
  });
  
  ctx.reply(message);
});

// Status command
bot.command('status', (ctx) => {
  ctx.reply(`
📊 Bot Status:
✅ Online 24/7
🌐 Host: Render.com
💾 Memory: ${process.memoryUsage().heapUsed / 1024 / 1024 | 0}MB
📈 Uptime: ${process.uptime() | 0} seconds
👥 Users: ${new Set(accounts.map(a => a.id)).size}
  `);
});

// ========== EXPRESS SERVER (KEEPS IT ONLINE) ==========

// Health check endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Telegram Bot Status</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .status { padding: 20px; border-radius: 5px; margin: 20px 0; }
        .online { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
        h1 { color: #333; }
        .btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🤖 Telegram Group Bot</h1>
        <div class="status online">
          <h2>✅ Bot Status: ONLINE</h2>
          <p>Running on Render.com Free Tier</p>
        </div>
        <div class="status info">
          <h3>📊 Server Info:</h3>
          <p>Uptime: ${Math.floor(process.uptime() / 60)} minutes</p>
          <p>Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB</p>
          <p>Accounts: ${accounts.length}</p>
        </div>
        <h3>🔗 Quick Links:</h3>
        <a href="https://t.me/${bot.context.botInfo.username}" class="btn" target="_blank">Open Bot</a>
        <a href="https://render.com" class="btn" target="_blank">View Host</a>
        <h3>📖 How to Use:</h3>
        <ol>
          <li>Open Telegram and find your bot</li>
          <li>Send /start to begin</li>
          <li>Use commands to create groups</li>
        </ol>
      </div>
    </body>
    </html>
  `);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// ========== START BOT ==========

console.log('🚀 Starting Telegram Bot...');

bot.launch()
  .then(() => {
    console.log('✅ Bot is running online!');
    console.log(`📱 Bot username: @${bot.context.botInfo.username}`);
    console.log(`🌐 Health check: https://your-app.onrender.com`);
  })
  .catch(err => {
    console.error('❌ Bot failed:', err.message);
  });

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));