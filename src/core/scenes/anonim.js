const { Scenes } = require("telegraf");

const anonim = new Scenes.BaseScene("anonim");

anonim.enter((ctx) => {
  ctx.replyWithHTML("<b>Xabaringizni yuboring</b>\nBarchasi anonim ✅", {
    reply_markup: {
      force_reply: true,
      keyboard: [[{ text: "❌ Bekor qilish" }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

anonim.on("text", async (ctx) => {
  if (ctx.msg.text.startsWith("/")) {
    ctx.replyWithHTML(
      `Kechirasiz, bot buyruqlarini xabar sifatida yubora olmaysiz!`
    );
  } else if (ctx.msg.text == "❌ Bekor qilish") {
    await ctx.scene.leave();
    ctx.replyWithHTML(`<b>Muvaffaqiyatli bekor qilindi</b> ✅`, {
      reply_markup: {
        keyboard: [[{ text: "🛡 Anonim" }, { text: "👀 Anonim emas" }]],
        resize_keyboard: true,
      },
    });
  } else {
    await ctx.telegram
      .sendMessage(
        5511267540,
        `✉️ <b>Sizda yangi anonim xabar bor:</b>\n\n<i>${ctx.msg.text}</i>`,
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Javob berish ⏩",
                  callback_data: `reply_${ctx.from.id}`,
                },
              ],
            ],
          },
        }
      )
      .then(() => {
        ctx.replyWithHTML(`<b>Xabaringiz muvaffaqiyatli yuborildi ✅</b>`, {
          reply_markup: {
            keyboard: [[{ text: "🛡 Anonim" }, { text: "👀 Anonim emas" }]],
            resize_keyboard: true,
          },
        });
        return ctx.scene.leave();
      })
      .catch((err) => {
        ctx.replyWithHTML(
          `<b>Xabar yuborishda xatolik yuzaga keldi</b> ❌\nQayta urining yoki adminni ogohlantiring: @umidxon_polatxonov`,
          {
            reply_markup: {
              keyboard: [[{ text: "🛡 Anonim" }, { text: "👀 Anonim emas" }]],
              resize_keyboard: true,
            },
          }
        );
        console.error("~ERROR: Error sending message:\n", err);
      });
  }
});

anonim.on("message", async (ctx) => {
  await ctx
    .copyMessage(5511267540, ctx.chat.id, ctx.msg.message_id)
    .then(async () =>
      ctx.replyWithHTML("<b> Xabaringiz muvaffaqiyatli yuborildi </b> ✅", {
        reply_markup: {
          keyboard: [[{ text: "🛡 Anonim" }, { text: "👀 Anonim emas" }]],
          resize_keyboard: true,
        },
      })
    )
    .catch((err) => {
      ctx.replyWithHTML(
        `<b>Xabar yuborishda xatolik yuzaga keldi</b> ❌\nQayta urining yoki adminni ogohlantiring: @umidxon_polatxonov`,
        {
          reply_markup: {
            keyboard: [[{ text: "🛡 Anonim" }, { text: "👀 Anonim emas" }]],
            resize_keyboard: true,
          },
        }
      );
      ctx.telegram.sendMessage(
        -1002069272637,
        `<a href="tg://user?id=${ctx.from.id}" >${ctx.from.first_name}</a> foydalanuvchi bilan xatolik yuz berdi: \n${err.message}`,
        { parse_mode: "HTML" }
      );
      console.error(err);
    });
  ctx.telegram
    .sendMessage(5511267540, `✉️ <b>Sizda yangi anonim xabar bor </b>👆`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Javob berish ⏩",
              callback_data: `reply_${ctx.from.id}`,
            },
          ],
        ],
      },
    })
    .catch((err) => {
      ctx.telegram.sendMessage(
        -1002069272637,
        `<a href="tg://user?id=${ctx.from.id}" >${ctx.from.first_name}</a> foydalanuvchi bilan xatolik yuz berdi: \n${err.message}`,
        { parse_mode: "HTML" }
      );
      console.error(err);
    });
  return ctx.scene.leave();
});

module.exports = anonim;
