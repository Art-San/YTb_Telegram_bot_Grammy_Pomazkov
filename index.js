import * as dotenv from 'dotenv'
import { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } from 'grammy'

import { hydrate } from '@grammyjs/hydrate'
dotenv.config()

// 1:03:00 меню надо делать
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN)
bot.use(hydrate())

bot.api.setMyCommands([
  {
    command: 'start',
    description: ' Запуск бота'
  },
  {
    command: 'menu',
    description: 'получить меню'
  }
])

bot.command('start', async (ctx) => {
  console.log(0, ctx.from.id)
  ctx.react('⚡')
  await ctx.reply(
    'Привет\\! Я\\-бот тг канал: _Ссылка_  *ЖИРный* [это ссылка](https://t.me/+8HmJ_p_8EQYzMTMy)',
    {
      parse_mode: 'MarkdownV2'
    }
  )
})

const menuKeyboard = new InlineKeyboard()
  .text('Узнать статус заказа', 'order-status')
  .text('Обратиться в поддержку', 'support')

const backKeyboard = new InlineKeyboard().text('< Назад в меню', 'back')

bot.command('menu', async (ctx) => {
  await ctx.reply('Выберите пункт меню', { reply_markup: menuKeyboard })
})

bot.callbackQuery('order-status', async (ctx) => {
  // await ctx.callbackQuery.message.editText('Статус заказа: в пути ', {
  //   reply_markup: backKeyboard
  // })

  // аналог hydrate
  await ctx.api.editMessageText(
    ctx.chat.id,
    ctx.update.callback_query.message.message_id,
    'Статус заказа: в пути ',
    { reply_markup: backKeyboard }
  )
  await ctx.answerCallbackQuery()
})
bot.callbackQuery('support', async (ctx) => {
  await ctx.callbackQuery.message.editText('Напишите ваш запрос', {
    reply_markup: backKeyboard
  })
  await ctx.answerCallbackQuery()
})
bot.callbackQuery('back', async (ctx) => {
  await ctx.callbackQuery.message.editText('Выберите пункт меню', {
    reply_markup: menuKeyboard
  })
  await ctx.answerCallbackQuery()
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

bot.start().then(() => {
  console.log('Bot play')
})
