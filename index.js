const { Client, TextChannel, RichEmbed, EmbedBuilder, GatewayIntentBits, Colors, Embed } = require('discord.js')
const { Image, createCanvas } = require('canvas')
const { NSFWJS } = require('nsfwjs')
const config = require('./config')

const bot = new Client({
  disabledEvents: [
    'TYPING_START'
  ],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ]
})

const modelUrl = 'https://nsfwjs-model-v3.now.sh/'
const nsfwjs = new NSFWJS(modelUrl, { size: 299 })

bot.on('ready', async () => {
  await nsfwjs.load()
    .catch(console.error)
  console.log(`Logged in as ${bot.user.tag}!`)
})

bot.on('messageCreate', (message) => {
  if (!(message.channel instanceof TextChannel)) return // テキストチャンネルでない場合は無視
  if (message.channel.nsfw) return // 閲覧注意のチャンネルは無視
  if (!message.attachments.size) return // 添付ファイルがない場合は無視
  const attachment = message.attachments.first()
  if (!attachment.height && !attachment.width) return // 画像でない場合は無視

  const width = attachment.width
  const height = attachment.height
  const image = new Image()
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  image.src = attachment.url
  image.onload = () => {
    ctx.drawImage(image, 0, 0, width, height)
    nsfwjs.classify(canvas)
      .then(result => result[0])
      .then((result) => {
        if (result.className === 'Neutral' || result.className === 'Drawing') return // 問題なければ無視
        message.delete() // 画像を削除
          .then((msg) => {
            msg.channel.send({embeds: [new EmbedBuilder()
              .setColor(Colors.Red)
              .setDescription(`${message.author.tag} が送信した画像に不適切な内容が含まれている可能性があるため削除しました。`)
              .addFields({name: 'もっとも多く含まれていた要素', value: result.className})
              .addFields({name: '不適切である確率', value: `${Math.round(result.probability * 100)}%`})
            ]})
          })
          .catch(console.error)
      })
      .catch(console.error)
  }
  image.onerror = (err) => console.error(err)
})

bot.login(config.TOKEN)
