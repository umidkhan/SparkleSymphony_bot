const { Telegraf, session, Scenes } = require("telegraf");
const Users = require("./models/userModel");
const mongoose = require("mongoose");
const { anonim, nonAnonim, adminReply, commandReply } = require("./scenes");
require("dotenv").config();

const bot = new Telegraf(process.env.TOKEN);
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Succesfully connected to database"))
  .catch((err) => console.error(err));

const stage = new Scenes.Stage([anonim, nonAnonim, adminReply, commandReply]);
bot.use(session());
bot.use(stage.middleware());

bot.use(async (ctx, next) => {
  if (ctx.chat?.type == "group" || ctx.chat?.type == "supergroup") {
    await ctx.reply(
      "Ushbu bot faqat shaxsiyda ishlaydi!\nIltimos shaxsiy chatdan foydalanib qaytadan urinib ko'ring"
    );
    return;
  }
  await next();
});

bot.start(async (ctx) => {
  try {
    const isExist = await Users.findOne({ chatId: ctx.from.id });

    if (!isExist) {
      await Users.create({
        chatId: ctx.from.id,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
        username: ctx.from.username,
        language: ctx.from.language_code,
      }).then(() => {
        ctx.telegram.sendMessage(
          -1002069272637,
          `Yangi foydalanuvchi ro'yxatdan o'tdi!\n👤 Ism: <a href="tg://user?id=${
            ctx.from.id
          }">${ctx.from.first_name}</a>\n🆔 Chat ID: <code>${
            ctx.from.id
          }</code>\n🔗 Username: ${
            ctx.from.username === undefined
              ? "Username not set"
              : "@" + ctx.from.username
          }\n\n<i>#new_user</i> / <i>#sparklesymphony_bot</i>`,
          {
            parse_mode: "HTML",
          }
        );
      });
    }
  } catch (err) {
    console.error("Error creating user: ", err.message);
    ctx.reply(
      "Siz uchun noma'lum bo'lgan xatolik yuzaga keldi ❗️\n\nYordam sifatida adminni ogohlantirishingiz mumkin: @umidxon_polatxonov"
    );
    ctx.telegram.sendMessage(
      -1002069272637,
      `Error creating user: ${err.message}\n\n#error`
    );
  }

  ctx.replyWithHTML(
    `<b>Assalomu alaykum <a href="tg://user?id=${ctx.from.id}">${ctx.from.first_name}</a></b>\n<b>Meyra</b> uchun xabarlar qabul qilinadi`,
    {
      link_preview_options: {
        is_disabled: true,
      },
      reply_markup: {
        keyboard: [[{ text: "🛡 Anonim" }, { text: "👀 Anonim emas" }]],
        resize_keyboard: true,
      },
    }
  );
});

bot.hears("🛡 Anonim", async (ctx) => {
  await ctx.scene.enter("anonim");
});

bot.hears("👀 Anonim emas", async (ctx) => {
  await ctx.scene.enter("nonAnonim");
});

bot.hears("❌ Bekor qilish", async (ctx) => {
  await ctx.scene.leave();
  ctx.replyWithHTML(`<b>Muvaffaqiyatli bekor qilindi</b> ✅`, {
    reply_markup: {
      keyboard: [[{ text: "🛡 Anonim" }, { text: "👀 Anonim emas" }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

bot.command("message", async (ctx) => {
  const msgText = ctx.msg.text.split(" ");
  ctx.session.userId = msgText[1];
  await ctx.scene.enter("commandReply");
});

bot.action(/reply_(\d+)/, async (ctx) => {
  ctx.session.userId = ctx.match[1];
  ctx.scene.enter("adminReply");
  ctx.answerCbQuery();
});

bot.command("broadcast", async (ctx) => {
  if (ctx.chat.id == 5511267540) {
    try {
      const allUsers = await Users.find({});
      const args = ctx.msg.text.split(" ");
      if (args.length < 2) {
        return ctx.reply("Noto'g'ri format!");
      }
      const postId = args[1];
      const channelId = -1002460351194;
      allUsers.forEach(async (user) => {
        await ctx.telegram
          .copyMessage(user.chatId, channelId, postId)
          .catch(async (err) => {
            if (err.response.error_code == 400) {
              ctx.reply("Post topilmadi");
            } else if (err.response.error_code === 403) {
              ctx.reply(`Kechirasiz, ushbu foydalanuvchi botni bloklagan! 🚫`);
              ctx.telegram.sendMessage(
                -1002069272637,
                `Xatolik yuzaga keldi!\nDescription: ${err.response.description}\nError code: ${err.response.error_code}`
              );
              await Users.deleteOne({ chatId: user.chatId });
            } else {
              ctx.reply("Postni uzatishda muammo yuzaga keldi", err.response);
              console.error(err);
            }
          });
      });
      ctx.telegram.sendMessage(
        5511267540,
        `Xabar barcha foydalanuvchilarga muvaffaqiyatli yuborildi ✅`
      );
    } catch (err) {
      console.error(err);
      return ctx.reply(
        "Xabarlarni broadcast qilishda xatolik yuzaga keldi",
        err.response
      );
    }
  } else {
    ctx.reply("Bu buyruq siz uchun emas!");
  }
});

bot.command("forward", async (ctx) => {
  if (ctx.chat.id == 5511267540) {
    try {
      const allUsers = await Users.find({});
      const args = ctx.msg.text.split(" ");

      if (args.length < 2) {
        return ctx.reply("Noto'g'ri format!");
      }

      const postId = args[1];
      const channelId = -1002460351194;

      allUsers.forEach(async (user) => {
        await ctx.telegram
          .forwardMessage(user.chatId, channelId, postId)
          .catch(async (err) => {
            if (err.response.error_code == 400) {
              ctx.reply("Post topilmadi");
            } else if (err.response.error_code === 403) {
              ctx.reply(`Kechirasiz, ushbu foydalanuvchi botni bloklagan! 🚫`);
              ctx.telegram.sendMessage(
                -1002069272637,
                `Xatolik yuzaga keldi!\nDescription: ${err.response.description}\nError code: ${err.response.error_code}`
              );
              await Users.deleteOne({ chatId: user.chatId });
            } else {
              ctx.reply(
                "Postni uzatishda muammo yuzaga keldi",
                err.response.description
              );
              console.error(err);
            }
          });
      });
      ctx.reply("Post barcha foydalanuvchilarga uzatildi ✅");
    } catch (err) {
      console.log(err);
      return ctx.reply("Xabarni forward qilishda muammo yuzaga keldi");
    }
  } else {
    ctx.reply(`Bu buyruq siz uchun emas!`);
  }
});

bot.launch(() => {
  bot.telegram.sendMessage(5511267540, "Bot started\n👉 /start");
  console.log("Bot started");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
module.exports = bot;
