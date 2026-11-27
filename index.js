const express = require("express");
const https = require("https");

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN || "8748404580:AAE8joRHKRVYtOjY5bONR68hJFdU9TvNUQY";
const PORT = process.env.PORT || 3000;

const mainKeyboard = {
  keyboard: [
    [
      { text: "🎮 سێرڤەری خۆڕایی ⚡" },
      { text: "👑 سێرڤەری VIP 💎" }
    ],
    [
      { text: "🎁 دیاریەکان 🏆" },
      { text: "📢 کەناڵی تلیگرام 🚀" }
    ],
    [
      { text: "🌐 وێبسایت 🖥️" },
      { text: "🎵 تیک تۆک 🔥" }
    ],
    [
      { text: "🛠️ چارەسەری کێشەی سێرڤەر ⚙️" },
      { text: "🔑 وەرگرتنی کۆد 🧩" }
    ],
    [
      { text: "🕹️ GTA 6 بۆ PS5 🎯" },
      { text: "🟢 GTA6 بۆ Xbox 🔥" }
    ]
  ],
  resize_keyboard: true
};

function telegramRequest(method, bodyObj) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(bodyObj);
    const options = {
      hostname: "api.telegram.org",
      path: `/bot${TOKEN}/${method}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve({ ok: false, raw: data });
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

async function sendMessage(chatId, text, replyMarkup = null) {
  const body = {
    chat_id: chatId,
    text: text,
    disable_web_page_preview: false
  };
  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }
  try {
    await telegramRequest("sendMessage", body);
  } catch (err) {
    console.error("Send message error:", err.message);
  }
}

app.get("/", (req, res) => {
  res.status(200).send("Althar Gaming Bot is Live!");
});

app.post("/webhook", async (req, res) => {
  res.status(200).json({ ok: true });

  const message = req.body && req.body.message;
  if (!message || !message.chat || !message.text) return;

  const chatId = message.chat.id;
  const text = message.text.trim();
  if (!text) return;

  if (text === "/start") {
    await sendMessage(
      chatId,
      "🔥 بەخێربێیت بۆ ناوەندی ئارسەر گەیمینگ (@Althar_Kurdish)!\n\n🎮 لە لیستەی خوارەوە بەشی دڵخوازت هەڵبژێرە و بچۆ ناو جیهانی یاری و سێرڤەرەکان:",
      mainKeyboard
    );
    return;
  }

  if (text.includes("سێرڤەری خۆڕایی")) {
    await sendMessage(
      chatId,
      `
      ⚡ سێرڤەری خۆڕایی.          (Free Server)

بۆ وەرگرتنی سێرڤەری خۆرایی:
یەکەم: خۆت تۆمار بکە لە وێبسایت.

دووەم: کۆنسۆڵەکەت داخل بکە.

سێیەم: دەتوانی پۆینت کۆبکیەوە بۆ کراک




وێبسایت:❤️👇🏻

https://altharkurdishm.kesug.com/
      
      
      `,
      mainKeyboard
    );
    return;
  }

  if (text.includes("سێرڤەری VIP")) {
    await sendMessage(
      chatId,
      "👑 **سێرڤەری VIP (تایبەت و خێرا)**\n\n• پینگ نزم و جێگیری بەرزتر\n• تایبەتمەندی و ئیمتیازی تایبەت بە ئەندامانی VIP\n• بۆ بەدەستهێنانی دەستپێگەیشتن یان زانیاری زیاتر، لە کەناڵی تلیگرام ئاگادار بە.",
      mainKeyboard
    );
    return;
  }

  if (text.includes("دیاریەکان")) {
    await sendMessage(
      chatId,
      "🎁 **دیاریەکان و پێشبڕکێی گەیمینگ**\n\n• دابەشکردنی کۆد، ئەکاونت و دیاری تایبەت بە یاریزانە چالاکەکان\n• چاودێری کەناڵی تلیگرام و تیک تۆک بکە بۆ کاتی ڕاگەیاندنی دیارییە نوێیەکان!",
      mainKeyboard
    );
    return;
  }

  if (text.includes("کەناڵی تلیگرام")) {
    await sendMessage(
      chatId,
      "📢 **کەناڵی فەرمی تلیگرام**\n\nبۆ نوێترین هەواڵ، کۆدی سێرڤەر و دیارییەکان بەشداری کەناڵەکە بکە:\n👉 لینکی کەناڵەکەت لێرە دابنێ (بۆ نموونە: https://t.me/YourChannel)",
      mainKeyboard
    );
    return;
  }

  if (text.includes("وێبسایت")) {
    await sendMessage(
      chatId,
      "🌐 **وێبسایتی فەرمی**\n\nسەردانی وێبسایت بکە بۆ زانیاری زیاتر و خزمەتگوزارییەکان:\n👉 لینکی وێبسایتەکەت لێرە دابنێ (بۆ نموونە: https://your-website.com)",
      mainKeyboard
    );
    return;
  }

  if (text.includes("تیک تۆک")) {
    await sendMessage(
      chatId,
      "🎵 **هەژماری فەرمی تیک تۆک**\n\nکلیپ، گەیمپلەی، و نوێترین شیکاری یارییەکان لە تیک تۆک ببینە:\n👉 لینکی تیک تۆکەکەت لێرە دابنێ (بۆ نموونە: https://www.tiktok.com/@barge_adaby)",
      mainKeyboard
    );
    return;
  }

  if (text.includes("چارەسەری کێشەی سێرڤەر")) {
    await sendMessage(
      chatId,
      "🛠️ **چارەسەری خێرای کێشەی سێرڤەر**\n\n1️⃣ ئینتەرنێت و ڕاوتەر / مۆدێم جارێک بکوژێنەرەوە و هەڵیکەرەوە.\n2️⃣ ئەگەر پینگ بەرز بوو، سێرڤەرێکی نزیکتر هەڵبژێرە یان VPN بکوژێنەرەوە (مەگەر بۆ کردنەوەی سێرڤەر پێویست بێت).\n3️⃣ یاری و کلاینتەکە بە تەواوی دابخە و دووبارە بیکەرەوە.\n4️⃣ دڵنیابە لەوەی کۆد یان ناونیشانی سێرڤەر بەبێ بۆشایی زیادە نووسیوە.",
      mainKeyboard
    );
    return;
  }

  if (text.includes("وەرگرتنی کۆد")) {
    await sendMessage(
      chatId,
      "🔑 **وەرگرتنی کۆد**\n\n• کۆدە چالاکەکان لە کەناڵی تلیگرام و بەشە تایبەتەکان بڵاو دەکرێنەوە.\n• کۆدەکە بە وردی کۆپی بکە و لە شوێنی دیاریکراودا بیلکێنە (Paste).\n• ئەگەر کۆدێک کاری نەکرد، لەوانەیە کاتی بەسەرچووبێت یان سنووری بەکارهێنانی تەواو بووبێت.",
      mainKeyboard
    );
    return;
  }

  if (text.includes("GTA 6 بۆ PS5") || text.includes("GTA6 بۆ PS5")) {
    await sendMessage(
      chatId,
      "🕹️ **GTA 6 — وەشانی PlayStation 5 (PS5)**\n\n• پلاتفۆرم: PS5 / PS5 Pro\n• هەموو هەواڵ، ترەیلەر، و نوێکارییەکانی Grand Theft Auto VI بۆ PS5 لێرە و لە کەناڵی تلیگرام کۆ دەکرێنەوە.\n• دڵنیابە لە پاشەکەوتکردنی جێگای پێویست لەسەر SSD پێش بڵاوبوونەوە و دابەزاندن.",
      mainKeyboard
    );
    return;
  }

  if (text.includes("GTA6 بۆ Xbox") || text.includes("GTA 6 بۆ Xbox")) {
    await sendMessage(
      chatId,
      "🟢 **GTA 6 — وەشانی Xbox Series X|S**\n\n• پلاتفۆرم: Xbox Series X و Xbox Series S\n• نوێترین زانیاری، وردەکاری، و ئاگادارییەکانی Grand Theft Auto VI بۆ ئێکس بۆکس لێرە بەردەست دەبن.\n• چاودێری کەناڵ و تیک تۆک بکە بۆ هەر نوێکارییەکی فەرمی.",
      mainKeyboard
    );
    return;
  }

  await sendMessage(
    chatId,
    "🎮 نامەکەت گەیشت! بۆ بینینی بەشەکان `/start` بنێرە یان یەکێک لە دوگمەکانی خوارەوە هەڵبژێرە.",
    mainKeyboard
  );
});
const webhokBot = require("./webhok");

// ڕێگای بۆتی یەکەم (ئەگەر پێشتر لە شوێنێکی تر هەیە، دووبارە مەیکەرەوە)
app.post("/webhook", async (req, res) => {
  // لێرە لۆجیکی بۆتی یەکەم بانگ بکە یان جێبەجێ بکە
  res.status(200).json({ ok: true });
});

// ڕێگای بۆتی دووەم (webhok.js)
app.post("/webhook-webhok", async (req, res) => {
  await webhokBot.handleWebhook(req, res);
});
app.listen(PORT, () => {
  console.log(`Althar gaming bot server listening on port ${PORT}`);
});
