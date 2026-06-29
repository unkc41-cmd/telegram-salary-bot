const express = require("express");
const { Telegraf } = require("telegraf");
const { google } = require("googleapis");

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const SHEET_ID = process.env.SHEET_ID;

const bot = new Telegraf(BOT_TOKEN);

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
});

async function sheetsClient() {
  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client });
}

bot.start((ctx) => {
  return ctx.reply("👇 Обери дію:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "💰 Моя ЗП", callback_data: "salary" }],
        [{ text: "🆔 Мій ID", callback_data: "id" }]
      ]
    }
  });
});

bot.on("callback_query", async (ctx) => {
  const action = ctx.callbackQuery.data;
  const chatId = ctx.from.id;

  await ctx.answerCbQuery();

  if (action === "id") {
    return ctx.reply("🆔 " + chatId);
  }

if (action === "salary") {
  const sheets = await sheetsClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "Лист1!A:C"
  });

  const rows = res.data.values || [];

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === String(chatId).trim()) {
      return ctx.reply(
        "💰 ЗП: " + (rows[i][2] || "не вказана") + " грн"
      );
    }
  }

  return ctx.reply(
    "❌ ID не знайдено.\nТвій ID: " + chatId
  );
}
    const sheets = await sheetsClient();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Лист1!A:D"
    });

    const rows = res.data.values || [];

    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === String(chatId)) {
        return ctx.reply("💰 ЗП: " + (rows[i][2] || 0) + " грн");
      }
    }

    return ctx.reply("ℹ️ Зарплата не знайдена");
  }
});

app.post("/webhook", (req, res) => {
  bot.handleUpdate(req.body);
  res.send("ok");
});

app.get("/", (req, res) => {
  res.send("Bot running");
});

app.listen(process.env.PORT || 3000);
