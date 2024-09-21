const { Scenes } = require("telegraf");

const senderScene = new Scenes.BaseScene("senderScene");
senderScene.enter((ctx) =>
  ctx.reply(
    `Matnli xabar yuboring\nXabar kim tomonidan yuborilgani @umidxon_polatxonov'ga ko'rinadi ⚠️`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Bekor qilish ❌", callback_data: "cencel" }],
        ],
      },
    }
  )
);

senderScene.on("text", (ctx) => {
  const chatId = ctx.from.id;
  if (ctx.msg.text.startsWith("/")) {
    ctx.reply("Kechirasiz, bot buyruqlarini yuborish imkonsiz");
  } else {
    ctx.reply(
      `<b>Xabaringiz muvaffaqiyatli yuborildi ✅</b>\nYana xabar yuborish uchun /new_message buyru'gidan foydalaning`,
      { parse_mode: "HTML" }
    );
    setTimeout(() => {
      ctx.telegram
        .sendMessage(
          5288176763,
          `📨 <b>Sizda yangi xabar bor</b>\n\n👤 Ism: <a href="tg://user?id=${chatId}" >${
            ctx.from.first_name
          }</a>\n🆔 Chat ID: <code>${ctx.from.id}</code>\n🔗 Username: ${
            ctx.from.username === undefined
              ? "Username not set"
              : "@" + ctx.from.username
          }\n💬 Xabar 👉 <i>${ctx.msg.text}</i>`,
          { parse_mode: "HTML" }
        )
        .catch((err) =>
          ctx.reply(
            "Xabar yuborishda xatolik yuzaga keldi ❌\nIltimos qayta urining"
          )
        );
    }, 100);
    return ctx.scene.leave();
  }
});

senderScene.on("message", (ctx) => {
  ctx.reply("Iltimos faqat matnli xabar yuboring!");
});

module.exports = senderScene;
