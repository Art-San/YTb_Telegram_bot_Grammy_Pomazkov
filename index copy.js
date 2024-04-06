import * as dotenv from 'dotenv'
import { Bot, GrammyError, HttpError } from 'grammy'

dotenv.config()

// 27:36

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN)

bot.on('msg').filter(
  (ctx) => {
    // асинхронной ее не надо делать
    console.log(1, typeof ctx.from.id)
    return ctx.from.id === 721836748
  },

  async (ctx) => {
    await ctx.reply('привет админ')
  }
)

// bot.on('message', async (ctx) => {
//   console.log(0, ctx.from.id)
// })
// bot.on(':photo').on('::hashtag', async () => {
//   await ctx.reply('фото и && hashtag')
// })

bot.on([':media', '::url'], async (ctx) => {
  // тригерит на фото ИЛИ ссылку
  await ctx.reply('фото или || видео || юрл')
})

bot.api.setMyCommands([
  {
    command: 'start',
    description: ' Запуск бота'
  },
  {
    command: 'hello',
    description: 'получить приветствие'
  },
  {
    command: 'help',
    description: ' получить помощь'
  }
])

bot.command(['say_hello', 'hello', 'say_hi'], async (ctx) => {
  await ctx.reply('Hello')
})

bot.command('start', async (ctx) => {
  await ctx.reply('Привет! Я-бот')
})

bot.catch((err) => {
  const ctx = err.ctx
  console.error(`Error while handling update ${ctx.update.update_id}`)
  const e = err.error

  if (e instanceof GrammyError) {
    console.error('Error in request', e.description)
  } else if (e instanceof HttpError) {
    console.error('Error not contact Telegram', e)
  } else {
    console.error('X-Z', e)
  }
})

bot.start()
