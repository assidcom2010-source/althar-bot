const express = require("express");
const https = require("https");

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN || "8748404580:AAE8joRHKRVYtOjY5bONR68hJFdU9TvNUQY";
const PORT = process.env.PORT || 3000;

const autoReplies = {
  "سڵاو": "سڵاو، بەخێربێیت! چۆن دەتوانم یارمەتیت بدەم؟",
  "چۆنی": "سوپاس، من باشم! تۆ چۆنیت؟",
  "نرخ": "بۆ زانینی نرخەکان، تکایە ناوی داواکارییەکەت بە ڕوونی بنووسە.",
  "کاتژمێر": "کاتەکانی کارکردن لە ٨:٠٠ی بەیانی تا ٥:٠٠ی ئێوارەیە.",
  "ناونیشان": "ناونیشانی ئێمە: هەولێر. بۆ زانیاری زیاتر پەیوەندی بکە.",
  "سوپاس": "سەرچاو، هەر کاتێک پێویستت بوو لە خزمەتدام."
};

const defaultReply =
  "ببورە، بۆ ئەو دەقە وەڵامێکی دیاریکراوم نییە. تکایە یەکێک لە وشەکانی وەک (سڵاو، چۆنی، نرخ، کاتژمێر، ناونیشان) بنووسە.";

function sendTelegramMessage(chatId, text) {
  const payload = JSON.stringify({
    chat_id: chatId,
    text: text
  });

  const options = {
    hostname: "api.telegram.org",
    path: `/bot${TOKEN}/sendMessage`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload)
    }
  };

  const req = https.request(options, (res) => {
    res.on("data", () => {});
  });

  req.on("error", (err) => {
    console.error("Telegram send error:", err.message);
  });

  req.write(payload);
  req.end();
}

// بۆ ئەوەی Render بزانێت سێرڤەرەکە زیندووە
app.get("/", (req, res) => {
  res.status(200).send("Althar bot server is running");
});

// خاڵی وەرگرتنی وێبووکی تێلێگرام
app.post("/webhook", (req, res) => {
  res.status(200).json({ ok: true });

  const message = req.body && req.body.message;
  if (!message || !message.chat || !message.text) return;

  const chatId = message.chat.id;
  const text = message.text.trim();
  if (!text) return;

  let reply = defaultReply;

  if (text === "/start") {
    reply =
      "سڵاو، بەخێربێیت! چۆن دەتوانم یارمەتیت بدەم؟ دەتوانیت وشەکانی وەک (سڵاو، چۆنی، نرخ، کاتژمێر، ناونیشان) بنووسیت.";
  } else {
    for (const [keyword, response] of Object.entries(autoReplies)) {
      if (text.includes(keyword)) {
        reply = response;
        break;
      }
    }
  }

  sendTelegramMessage(chatId, reply);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});