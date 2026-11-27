const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const codesFile = path.join(__dirname, "vip_codes.json");

function generateUniqueCode() {
    let codes = [];

    if (fs.existsSync(codesFile)) {
        codes = JSON.parse(fs.readFileSync(codesFile, "utf8"));
    }

    let code;

    do {
        const randomPart = crypto
            .randomBytes(6)
            .toString("hex")
            .toUpperCase();

        code = "VIP" + randomPart;
    } while (codes.includes(code));

    codes.push(code);

    fs.writeFileSync(
        codesFile,
        JSON.stringify(codes, null, 2),
        "utf8"
    );

    return code;
}




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
    `⚡ سێرڤەری خۆڕایی (Free Server)

بۆ وەرگرتنی سێرڤەری خۆڕایی:
یەکەم: خۆت تۆمار بکە لە وێبسایت.
دووەم: کۆنسۆڵەکەت داخڵ بکە.
سێیەم: دەتوانی پۆینت کۆبکەیتەوە بۆ کراک.

وێبسایت: ❤️👇🏻
https://altharkurdishm.kesug.com/`,
    mainKeyboard
  );
  return;
}
  if (text.includes("سێرڤەری VIP")) {
    await sendMessage(
      chatId,
      `👑 VIP SERVER | سێرڤەری تایبەتی و خێرا

🔥 ئەزموونێکی جیاواز لەگەڵ سێرڤەری VIP!

⚡ بەهێز و خێرا
💎 پاکێجی تایبەت بۆ ئەندامانی VIP
🚀 خێرایی و کارایی بەرز
🎮 پشتگیری و خزمەتگوزاری تایبەت
♾️ بەردەوامی و خۆشی بێ سنوور

🎯 چۆن ببیتە ئەندامی VIP؟

بۆ بەدەستهێنانی دەستپێگەیشتن و زانیاری زیاتر، ناو و ژمارەی مۆبایلت لە بەشی خوارەوە بنووسە، تیمەکەمان پەیوەندیت پێوە دەکات.

💰 جۆرەکانی بەشداری VIP:

1️⃣ بەشداری بە قیستی مانگانە
2️⃣ کڕینی پاکێجی ساڵانە
3️⃣ کڕینی بەشەکان بە جیاوازی

👑 VIP ـەکەت هەڵبژێرە و ئەزموونێکی تایبەت بکە!

📩 بۆ زانیاری زیاتر و تۆمارکردن، پەیوەندیمان پێوە بکە.`,
      mainKeyboard
    );
    return;
  }

  if (text.includes("دیاریەکان")) {
    await sendMessage(
      chatId,
      `🎁 GAMING GIVEAWAY | پێشبڕکێ و دیارییە تایبەتەکان 👑

🔥 ئامادەی وەرگرتنی دیارییەکانی گەیمینگیت؟

💎 بۆ یاریزانە چالاک و بەشدارییەکانمان، دیارییەکی تایبەتمان ئامادە کردووە!

🎁 دیارییەکانمان بریتین لە:
• کۆدی تایبەت بۆ یارییەکان 🎮
• ئەکاونتی یاری و دیارییە گەیمینگ 🔥
• خزمەتگوزاری و پاکێجی تایبەت بە یاریزانەکان 💎
• دیارییەکانی تر بۆ ئەندامانی چالاک 👑

🏆 چۆن بەشداری پێشبڕکێ بکەیت؟

1️⃣ پۆستەکەمان لە TikTok لایک بکە ❤️
2️⃣ کۆمێنتی جوان و زۆر بنووسە 💬
3️⃣ پۆستەکە لەگەڵ هاوڕێ گەیمەرەکانت هاوبەش بکە 🚀
4️⃣ سکرین‌شۆتی بەشدارییەکەت بۆمان بنێرە 📸

⏰ کاتی وەرگرتنی دیاری

لە ماوەی ٢٤ کاتژمێر دوای دیاریکردنی براوە، دیارییەکەت وەردەگریت! 🎁

👑 هەر بەشدارییەک هەلێکی زیاترە بۆ بردنەوە!

📢 چاودێری کەناڵی Telegram و TikTok ـمان بکە، چونکە دیاری و پێشبڕکێی نوێمان بەردەوام ڕادەگەیەنین.

🔥 بەشداری بکە، چالاک بە، و دیارییەکەت ببە! `,
      mainKeyboard
    );
    return;
  }

  if (text.includes("کەناڵی تلیگرام")) {
    await sendMessage(
      chatId,
      `📢 کەناڵی فەرمی تێلەگرام

بۆ نوێترین هەواڵ، کۆدی سێرڤەر، دیاری و پێشبڕکێیە تایبەتەکان، بەشداری کەناڵەکەمان بکە! 🎮🎁

👉 لینکی کەناڵ:
https://t.me/althar_kurdish

👑 بەشداری بکە و هیچ دیاری و هەواڵێکی نوێ لە دەست مەدە! `,
      mainKeyboard
    );
    return;
  }

  if (text.includes("وێبسایت")) {
    await sendMessage(
      chatId,
      `🚀 ALTHAR KURDISH | هەموو شتێک لە یەک شوێن! 👑

🎮 جیهانی گەیمینگ، خزمەتگوزارییە تایبەتەکان، سێرڤەری VIP و دیارییەکانمان لە نزیکەوە ببینە!

🌐 وێبسایتی فەرمی ئێمە
شوێنی تایبەت بۆ ناسینی خزمەتگوزارییەکانمان و دۆزینەوەی ئەوەی کە پێویستتە.

👉 https://altharkurdishm.kesug.com/

📢 کەناڵی فەرمی تێلەگرام
بۆ نوێترین هەواڵ، کۆدی سێرڤەر، دیاری و پێشبڕکێیەکانمان.

👉 https://t.me/althar_kurdish

🔥 ئێستا سەردانمان بکە و ببە بە بەشێک لە کۆمەڵگەی ALTHAR KURDISH!

💎 گەیمینگێکی جیاواز، خزمەتگوزارییەکی تایبەت، ئەزموونێکی نوێ!`,
      mainKeyboard
    );
    return;
  }

  if (text.includes("تیک تۆک")) {
    await sendMessage(
      chatId,
      `🎵 ALTHAR KURDISH | هەژماری فەرمی تیک تۆک 👑

🔥 جیهانی گەیمینگ لە شێوەیەکی جیاواز ببینە!

🎮 کلیپی تایبەتی یاری
⚡ گەیمپلەی سەرنجڕاکێش
💎 هەواڵ و زانیاری نوێی یارییەکان
🎁 دیاری و پێشبڕکێی تایبەت
🚀 چالاکی و ڤیدیۆی تایبەت بە کۆمەڵگەی گەیمینگ

❤️ فۆڵۆومان بکە، لایک و کۆمێنتەکانت بەجێبهێڵە و بەشداری چالاکییەکانمان بە!

👉 هەژماری فەرمی تیک تۆک:
https://www.tiktok.com/@_althar

👑 ALTHAR KURDISH
گەیمینگ تەنها یاری نییە، ئەزموونێکی جیاوازە!`,
      mainKeyboard
    );
    return;
  }

 if (text.includes("چارەسەری کێشەی سێرڤەر")) {
    await sendMessage(
        chatId,
        `🛠️ ALTHAR KURDISH | SERVER SUPPORT

🎮 یارمەتی و چارەسەری کێشەکانی سێرڤەر

━━━━━━━━━━━━━━

🔹 ١. کێشەی پەیوەندی
ئینتەرنێت و ڕاوتەر / مۆدێم بپشکنە و جارێک Restart ـیان بکە.

🔹 ٢. پینگ و لاگ
ئەگەر پینگ بەرزە، سێرڤەرێکی نزیکتر هەڵبژێرە یان VPN بکوژێنەوە.

🔹 ٣. کێشەی یاری
یاری و کلاینتەکە بە تەواوی دابخە و دووبارە بیکەرەوە.

🔹 ٤. کۆد و ناونیشان
دڵنیابە کۆد یان ناونیشانی سێرڤەر بە دروستی نووسیوە.

━━━━━━━━━━━━━━

🔑 کۆد و ئەکاونتی سێرڤەر

🎁 بۆ وەرگرتنی کۆد و زانیارییەکانی ئەکاونتی سێرڤەر، سەردانی کەناڵی فەرمی ئێمە بکە.

📢 Telegram:
https://t.me/althar_kurdish

━━━━━━━━━━━━━━

💎 هێشتا کێشەکەت چارەسەر نەبووە؟
📩 پەیوەندی بە پشتگیری بکە بۆ یارمەتی زیاتر.

👑 ALTHAR KURDISH
Gaming • VIP • Server Support`,
        mainKeyboard
    );
    return;
}
  if (text.includes("وەرگرتنی کۆد")) {

    const code = generateUniqueCode();

    await sendMessage(
        chatId,
        `🎁 **کۆدی تایبەتت ئامادەیە!**

🔐 **کۆدی تۆ:**
\`${code}\`

━━━━━━━━━━━━━━

✨ کۆدەکە کۆپی بکە و لە شوێنی دیاریکراودا بیلکێنە.

👑 **ALTHAR KURDISH**`,
        mainKeyboard
    );

    return;
}
  
if (text.includes("GTA 6 بۆ PS5") || text.includes("GTA6 بۆ PS5")) {
    await sendMessage(
        chatId,
        `🎮 ALTHAR KURDISH | GTA VI

🕹️ GTA VI — PlayStation 5

👑 بەخێربێیت بۆ جیهانی Grand Theft Auto VI!

━━━━━━━━━━━━━━

🎯 پلاتفۆرم:
• PlayStation 5
• PlayStation 5 Pro

📌 زانیاری و ڕێنمایی:
• نوێترین هەواڵ و زانیارییەکانی GTA VI
• ڕێنمایی دابەزاندن و چالاککردنی یاری
• زانیارییەکانی PlayStation Store

━━━━━━━━━━━━━━

🔑 چۆن یارییەکە دابەزێنیت؟

1️⃣ PS5 ـەکەت هەڵبکەرەوە.
2️⃣ بە ئەکاونتی PlayStation Network ـی خۆت داخڵ ببە.
3️⃣ PlayStation Store بکەرەوە.
4️⃣ GTA VI بگەڕێ و لاپەڕەی یارییەکە بکەرەوە.
5️⃣ ئەگەر بەردەست بوو، بە ئەکاونتی خۆت دایبەزێنە.

💎 بۆ زانیاری و نوێکارییەکان، کەناڵی فەرمی ئێمە چاودێری بکە.

📢 Telegram:
https://t.me/althar_kurdish

👑 ALTHAR KURDISH | GAMING SUPPORT`,
        mainKeyboard
    );
    return;
}

if (text.includes("GTA6 بۆ Xbox") || text.includes("GTA 6 بۆ Xbox")) {
    await sendMessage(
        chatId,
        `🎮 ALTHAR KURDISH | GTA VI

🟢 GTA VI — Xbox Series X|S

🔥 ئامادەی ئەزموونێکی جیاواز لە جیهانی GTA VI؟

━━━━━━━━━━━━━━

🎯 پلاتفۆرم:
• Xbox Series X
• Xbox Series S

📌 زانیاری و ڕێنمایی:
• نوێترین هەواڵ و وردەکارییەکانی GTA VI
• ڕێنمایی دابەزاندن و چالاککردنی یاری
• زانیارییەکانی Microsoft Store

━━━━━━━━━━━━━━

🔑 چۆن یارییەکە دابەزێنیت؟

1️⃣ Xbox ـەکەت هەڵبکەرەوە.
2️⃣ بە ئەکاونتی Microsoft / Xbox ـی خۆت داخڵ ببە.
3️⃣ Microsoft Store بکەرەوە.
4️⃣ GTA VI بگەڕێ و لاپەڕەی یارییەکە بکەرەوە.
5️⃣ ئەگەر بەردەست بوو، بە ئەکاونتی خۆت دایبەزێنە.

💎 بۆ زانیاری و نوێکارییەکان، کەناڵی فەرمی ئێمە چاودێری بکە.

📢 Telegram:
https://t.me/althar_kurdish

👑 ALTHAR KURDISH | GAMING SUPPORT`,
        mainKeyboard
    );
    return;
}

    if (text.includes("فێرکاری بە خۆڕایی")) {

    await bot.copyMessage(
        chatId,
        "@althar_kurdish",
        16
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
