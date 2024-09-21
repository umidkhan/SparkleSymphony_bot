const { Telegraf, session, Scenes } = require("telegraf");
const { anonimScene, senderScene } = require("./scenes");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([anonimScene, senderScene]);
bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  await ctx.reply(
    `Assalomu alaykum <a href="tg://user?id=${ctx.from.id}" >${ctx.from.first_name}</a>\n<b>Hazel Rae</b>'ga xabar yuborish uchun pastdagi istalgan turni tanlang 👇`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🛡 Anonim", callback_data: "anonim" },
            { text: "👀 Anonim emas", callback_data: "simple" },
          ],
        ],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    }
  );
});

bot.command("new_message", async (ctx) => {
  await ctx.reply("Qaysi turda xabar yubormoqchisiz? 👇", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🛡 Anonim", callback_data: "anonim" },
          { text: "👀 Anonim emas", callback_data: "simple" },
        ],
      ],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  });
});

bot.action("anonim", async (ctx) => {
  await ctx.scene.enter("anonimScene");
  ctx.answerCbQuery("Iltimos faqat matnli xabar yuboring");
  setTimeout(async () => {
    await ctx.telegram.deleteMessage(ctx.chat.id, ctx.msgId);
  }, 300);
});
bot.action("simple", async (ctx) => {
  await ctx.scene.enter("senderScene");
  ctx.answerCbQuery("Iltimos faqat matnli xabar yuboring");
  setTimeout(async () => {
    await ctx.telegram.deleteMessage(ctx.chat.id, ctx.msgId);
  }, 100);
});

bot.action("cencel", async (ctx) => {
  ctx.reply(
    "<b>Muvaffaqiyatli bekor qilindi</b>\nYangi xabar yuborish uchun <b>/new_message</b> buyrug'idan foydalanishingiz mumkin",
    { parse_mode: "HTML" }
  );
  await ctx.scene.leave();
  ctx.answerCbQuery("Bekor qilindi ✅");
  await ctx.telegram.deleteMessage(ctx.chat.id, ctx.msgId);
});

bot.hears("daily Umidxon", async (ctx) => {
  const channelId = -1001897939296;
  const userId = ctx.from.id;
  await bot.telegram
    .getChatMember(channelId, userId)
    .then(async (member) => {
      if (
        member.status == "creator" ||
        member.status == "administrator" ||
        member.status == "member"
      ) {
        await ctx.reply(
          `<b>Daily | Umidxon</b> kanaliga qo'shilish uchun havola:\n👉 https://t.me/+--6VdTGW8cxlYjdi`,
          { parse_mode: "HTML", protect_content: true }
        );
      } else {
        await ctx.reply(
          "Afsuski siz @Umidxon_blog kanaliga obuna bo'lmagan ekansiz. Avval kanalga obuna bo'ling!"
        );
      }
    })
    .catch((err) => ctx.reply("Noma'lum xatolik yuzaga keldi, qayta urining"));
});

bot.hears("Daily Umidxon", async (ctx) => {
  const channelId = -1001897939296;
  const userId = ctx.from.id;
  await bot.telegram
    .getChatMember(channelId, userId)
    .then(async (member) => {
      if (
        member.status == "creator" ||
        member.status == "administrator" ||
        member.status == "member"
      ) {
        await ctx.reply(
          `<b>Daily | Umidxon</b> kanaliga qo'shilish uchun havola:\n👉 https://t.me/+--6VdTGW8cxlYjdi`,
          { parse_mode: "HTML", protect_content: true }
        );
      } else {
        await ctx.reply(
          "Afsuski siz @Umidxon_blog kanaliga obuna bo'lmagan ekansiz. Avval kanalga obuna bo'ling!"
        );
      }
    })
    .catch((err) => ctx.reply("Noma'lum xatolik yuzaga keldi, qayta urining"));
});

bot.on("text", async (ctx) => {
  await ctx.reply(
    "Menimcha noto'g'ri buyruq yubordingiz 🤷‍♂️, tekshirib qaytadan urining"
  );
});
bot.on("message", async (ctx) => {
  await ctx.reply("Faqat matnli xabar qabul qilinadi");
});

bot.launch(() => {
  console.log(`Bot started!`);
});

module.exports = bot;
