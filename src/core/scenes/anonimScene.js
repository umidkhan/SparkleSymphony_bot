const { Scenes } = require("telegraf");

const anonimScene = new Scenes.BaseScene("anonimScene");
anonimScene.enter((ctx) => {
  ctx.reply("Matnli xabar yuboring", {
    reply_markup: {
      inline_keyboard: [[{ text: "Bekor qilish ❌", callback_data: "cencel" }]],
    },
  });
});

anonimScene.on("text", (ctx) => {
  if (ctx.msg.text.startsWith("/")) {
    ctx.reply("Kechirasiz, bot buyruqlarini yuborish imkonsiz");
  } else {
    ctx.reply(
      `<b>Xabaringiz muvaffaqiyatli yuborildi ✅</b>\nYana xabar yuborish uchun /new_message buyru'gidan foydalaning`,
      { parse_mode: "HTML" }
    );
    ctx.telegram
      .sendMessage(
        5288176763,
        `✉️ <b>Sizda yangi anonim xabar bor:</b>\n\n<i>${ctx.msg.text}</i>`,
        { parse_mode: "HTML" }
      )
      .catch((err) =>
        ctx.reply(
          "Xabar yuborishda xatolik yuzaga keldi ❌\nIltimos qayta urining"
        )
      );
    return ctx.scene.leave();
  }
});

anonimScene.on("message", (ctx) => {
  ctx.reply("Iltimos faqat matnli xabar yuboring!");
});

module.exports = anonimScene;
