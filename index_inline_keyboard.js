import * as dotenv from 'dotenv'
import { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } from 'grammy'

dotenv.config()

// 32:14
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN)

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
    command: 'share',
    description: 'Гео тел отправить'
  },
  {
    command: 'inline_keyboard',
    description: 'Клавиатура под сообщением'
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

bot.command('share', async (ctx) => {
  const shareKeyboard = new Keyboard()
    .requestLocation('Геолокация')
    .requestContact('Контакт')
    .requestPoll('Опрос')
    .resized()

  ctx.reply('Чем хочешь поделиться', { reply_markup: shareKeyboard })
})
bot.command('inline_keyboard', async (ctx) => {
  // const shareKeyboard = new InlineKeyboard()
  //   .text('1', 'button-1')
  //   .text('2', 'button-2').row()
  //   .text('3', 'button-3')

  const shareKeyboard2 = new InlineKeyboard().url(
    'Перейти в ТГ',
    'https://t.me/+8HmJ_p_8EQYzMTMy'
  )

  ctx.reply('Нажмите кнопку', { reply_markup: shareKeyboard2 })
  // ctx.reply('Выбери цифру', { reply_markup: shareKeyboard })
})

// bot.on('callback_query:data', async (ctx) => {
//   console.log(ctx.update.callback_query.data) // button-3
//   await ctx.answerCallbackQuery(ctx.callbackQuery.data)
//   await ctx.reply(`Вы нажали ${ctx.callbackQuery.data}`)
// })

bot.callbackQuery(/button-[1-3]/, async (ctx) => {
  // bot.callbackQuery(['button-1', 'button-2', 'button-3'], async (ctx) => {
  console.log(ctx.update.callback_query.data) // button-1
  await ctx.answerCallbackQuery(ctx.update.callback_query.data)
  await ctx.reply(`Вы нажали ${ctx.update.callback_query.data}`)
})

bot.on(':contact', async (ctx) => {
  console.log(0, ctx.update.message.contact)
  // console.log(1, ctx.message.contact)
  console.log(2, ctx.message.reply_to_message)
  await ctx.reply('Получили ваш номер ')
})

bot.command('mood', async (ctx) => {
  const moodLabels = ['хорошо', 'норм', 'плохо']
  const rows = moodLabels.map((label) => {
    return [Keyboard.text(label)]
  })

  const moodKeyboard2 = Keyboard.from(rows).resized()

  await ctx.reply('как настроение', {
    reply_markup: moodKeyboard2
  })
})
// bot.command('mood', async (ctx) => {
//   const moonKeyboard = new Keyboard()
//     .text('хорошо')
//     .row()
//     .text('норм')
//     .row()
//     .text('плохо')
//     .resized()
//   // .oneTime()
//   await ctx.reply('как настроение', {
//     reply_markup: moonKeyboard
//   })
// })

bot.hears('хорошо', async (ctx) => {
  console.log(0, ctx.from.id)
  await ctx.reply('Класс', {
    reply_markup: { remove_keyboard: true }
  })
})
// bot.command('start', async (ctx) => {
//   console.log(0, ctx.from.id)
//   await ctx.reply(
//     'Привет! Я-бот тг канал: <span class="tg-spoiler">Ссылка</span>',
//     // 'Привет! Я-бот тг канал: <a href="https://t.me/+8HmJ_p_8EQYzMTMy">Ссылка</a>',
//     {
//       parse_mode: 'HTML'
//     }
//   )
// })
// bot.command('start', async (ctx) => {
//   console.log(0, ctx.from.id)
//   await ctx.reply('Привет! Я-бот', {
//     reply_parameters: { message_id: ctx.msg.message_id }
//   })
// })

// bot.hears('пинг', async (ctx) => {
//   onsole.log(0, ctx)
//   await ctx.reply('ping')
// })
bot.hears('id', async (ctx) => {
  console.log(0, ctx.from.id)
  await ctx.reply(ctx.from.id)
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
