if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const DiscordBot = require('./discord-bot')

const bot = new DiscordBot()

bot.Start()
