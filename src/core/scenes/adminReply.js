const { Scenes } = require("telegraf");

const adminReply = new Scenes.BaseScene("adminReply");
adminReply.enter(async (ctx) => {
  ctx.replyWithHTML(
    `<b>Xabaringizni yuboring</b>\nKimdan yuborilgani adminga ko'rsatiladi ✅`,
    {
      reply_markup: {
        force_reply: true,
        keyboard: [[{ text: "❌ Bekor qilish" }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
});

adminReply.on("text", async (ctx) => {
  if (ctx.msg.text.startsWith("/")) {
    ctx.reply("Kechirasiz, bot buyruqlarini xabar sifatida yubora olmaysiz!");
  } else if (ctx.msg.text == "❌ Bekor qilish") {
    await ctx.scene.leave();
    ctx.replyWithHTML(`<b>Muvaffaqiyatli bekor qilindi</b> ✅`, {
      reply_markup: {
        keyboard: [[{ text: "🛡 Anonim" }, { text: "👀 Anonim emas" }]],
        resize_keyboard: true,
      },
    });
  } else {
    try {
      await ctx.telegram
        .sendMessage(
          ctx.session.userId,
          `📨 <b>Sizga <b>Meyra</b>dan yangi xabar: </b>\n\n<i>${ctx.msg.text}</i>\n\nℹ️ <i>Javob berish uchun pastdagi 2 usuldan birini tanlang</i> 👇`,
          {
            parse_mode: "HTML",
            link_preview_options: {
              is_disabled: true,
            },
            reply_markup: {
              keyboard: [[{ text: "🛡 Anonim" }, { text: "👀 Anonim emas" }]],
              resize_keyboard: true,
            },
          }
        )
        .then(async () => {
          ctx.replyWithHTML(`<b>Xabaringiz muvaffaqiyatli yuborildi ✅</b>`, {
            reply_markup: {
              keyboard: [[{ text: "🛡 Anonim" }, { text: "👀 Anonim emas" }]],
              resize_keyboard: true,
            },
          });
        });
    } catch (err) {
      console.error(err.response);
      if (err.response.error_code === 403) {
        ctx.reply(`Kechirasiz, ushbu foydalanuvchi botni bloklagan! 🚫`);
        ctx.telegram.sendMessage(
          -1002069272637,
          `Xatolik yuzaga keldi!\nDescription: ${err.response.description}\nError code: ${err.response.error_code}`
        );
      } else {
        ctx.reply("Xabaringizni yuborishda muammo yuzaga keldi!");
        ctx.telegram.sendMessage(
          -1002069272637,
          `Xatolik yuzaga keldi!\nDescription: ${err.response.description}\nError code: ${err.response.error_code}`
        );
      }
    }
  }

  return ctx.scene.leave();
});

adminReply.on("message", async (ctx) => {
  ctx
    .forwardMessage(ctx.session.userId, ctx.chat.id, ctx.msg.message_id)
    .then(async () => {
      setTimeout(async () => {
        await ctx.telegram.sendMessage(
          ctx.session.userId,
          `📨 <b>Sizga <b>Meyra</b>dan yangi xabar 👆</b>\n\nℹ️ <i>Javob berish uchun pastdagi 2 usuldan birini tanlang</i> 👇`,
          {
            parse_mode: "HTML",
            link_preview_options: {
              is_disabled: true,
            },
            reply_markup: {
              keyboard: [[{ text: "🛡 Anonim" }, { text: "👀 Anonim emas" }]],
              resize_keyboard: true,
            },
          }
        );
      }, 600);
      ctx.replyWithHTML(`<b>Xabaringiz muvaffaqiyatli yuborildi ✅</b>`, {
        reply_markup: {
          keyboard: [[{ text: "🛡 Anonim" }, { text: "👀 Anonim emas" }]],
          resize_keyboard: true,
        },
      });
    })
    .catch((err) => {
      console.error(err.response);
      if (err.response.error_code === 403) {
        ctx.reply(`Kechirasiz, ushbu foydalanuvchi botni bloklagan! 🚫`);
        ctx.telegram.sendMessage(
          -1002069272637,
          `Xatolik yuzaga keldi!\nDescription: ${err.response.description}\nError code: ${err.response.error_code}`
        );
      } else {
        ctx.reply("Xabaringizni yuborishda muammo yuzaga keldi!");
        ctx.telegram.sendMessage(
          -1002069272637,
          `Xatolik yuzaga keldi!\nDescription: ${err.response.description}\nError code: ${err.response.error_code}`
        );
      }
    });

  return ctx.scene.leave();
});

module.exports = adminReply;
