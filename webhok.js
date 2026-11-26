const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN || "1145477365:AAF5qLpAuk4SKwa9WYLeVmOPXubSjJcb7Ok";
const ADMIN_ID = process.env.ADMIN_ID ? String(process.env.ADMIN_ID).trim() : "1109412636";
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, "data");
const MEMBERS_FILE = path.join(__dirname, "Member.txt");

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getUserStateFile(fromId) {
  return path.join(DATA_DIR, String(fromId), "ali.txt");
}

function getUserTokenFile(fromId) {
  return path.join(DATA_DIR, String(fromId), "token.txt");
}

function getUserUrlFile(fromId) {
  return path.join(DATA_DIR, String(fromId), "url.txt");
}

function readState(fromId) {
  try {
    const file = getUserStateFile(fromId);
    if (!fs.existsSync(file)) return "";
    return fs.readFileSync(file, "utf8").trim();
  } catch {
    return "";
  }
}

function writeState(fromId, val) {
  try {
    const userDir = path.join(DATA_DIR, String(fromId));
    ensureDir(userDir);
    fs.writeFileSync(getUserStateFile(fromId), String(val), "utf8");
  } catch (err) {
    console.error("writeState error:", err.message);
  }
}

function readTokenFile(fromId) {
  try {
    const file = getUserTokenFile(fromId);
    if (!fs.existsSync(file)) return "";
    return fs.readFileSync(file, "utf8").trim();
  } catch {
    return "";
  }
}

function writeTokenFile(fromId, val) {
  try {
    const userDir = path.join(DATA_DIR, String(fromId));
    ensureDir(userDir);
    fs.writeFileSync(getUserTokenFile(fromId), String(val), "utf8");
  } catch (err) {
    console.error("writeTokenFile error:", err.message);
  }
}

function readUrlFile(fromId) {
  try {
    const file = getUserUrlFile(fromId);
    if (!fs.existsSync(file)) return "";
    return fs.readFileSync(file, "utf8").trim();
  } catch {
    return "";
  }
}

function writeUrlFile(fromId, val) {
  try {
    const userDir = path.join(DATA_DIR, String(fromId));
    ensureDir(userDir);
    fs.writeFileSync(getUserUrlFile(fromId), String(val), "utf8");
  } catch (err) {
    console.error("writeUrlFile error:", err.message);
  }
}

function registerMemberIfNew(fromId) {
  const idStr = String(fromId);
  const stateFile = getUserStateFile(idStr);
  if (!fs.existsSync(stateFile)) {
    ensureDir(path.join(DATA_DIR, idStr));
    fs.writeFileSync(stateFile, "none", "utf8");
    try {
      fs.appendFileSync(MEMBERS_FILE, `${idStr}\n`, "utf8");
    } catch (err) {
      console.error("appendMember error:", err.message);
    }
  }
}

function getMembersList() {
  try {
    if (!fs.existsSync(MEMBERS_FILE)) return [];
    const content = fs.readFileSync(MEMBERS_FILE, "utf8");
    return content
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

const startMainKeyboard = {
  resize_keyboard: true,
  keyboard: [
    [{ text: "⚙️ وێب هوک کردن 🛠️" }, { text: "زانیاری توکن📝🩸" }],
    [{ text: "✂️ سرینەوەی وێب هوک 🗑️" }, { text: "💛 بـۆتـەکـان 🧡" }]
  ]
};

const afterHookKeyboard = {
  resize_keyboard: true,
  keyboard: [
    [{ text: "⚙️ وێب هوک کردن 🛠️" }, { text: " زانیاری توکن📝🩸" }],
    [{ text: "✂️ سرینەوەی وێب هوک 🗑️" }, { text: "💛 بـۆتـەکـان 🧡" }]
  ]
};

const afterDelKeyboard = {
  resize_keyboard: true,
  keyboard: [
    [{ text: "⚙️ وێب هوک کردن 🛠️" }, { text: "زانیاری توکن📝🩸" }],
    [{ text: "✂️ سرینەوەی وێب هوک 🗑️" }, { text: "💛 بـۆتـەکـان 🧡" }]
  ]
};

const backKeyboard = {
  resize_keyboard: true,
  keyboard: [[{ text: "گەرانەوە 🔁" }]]
};

const adminPanelKeyboard = {
  resize_keyboard: true,
  keyboard: [
    [
      { text: "عدد اعضاء البوت  👬" },
      { text: "رسالة للمشتركين 📄" },
      { text: "توجيه للمشتركين 💎" }
    ]
  ]
};

const adminBackKeyboard = {
  resize_keyboard: true,
  keyboard: [[{ text: "/yusif" }]]
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function telegramApiPost(token, method, bodyObj) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(bodyObj);
    const options = {
      hostname: "api.telegram.org",
      path: `/bot${token}/${method}`,
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

function telegramApiGet(urlStr) {
  return new Promise((resolve, reject) => {
    https
      .get(urlStr, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve({ ok: false });
          }
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

async function bot(method, datas = {}) {
  try {
    return await telegramApiPost(TOKEN, method, datas);
  } catch (err) {
    console.error(`bot(${method}) error:`, err.message);
    return { ok: false };
  }
}

async function sendMessage(chatId, text, parseMode = null) {
  const payload = {
    chat_id: chatId,
    text: text
  };
  if (parseMode && String(parseMode).toLowerCase() !== "none") {
    payload.parse_mode = parseMode;
  }
  return await bot("sendMessage", payload);
}

async function sendAction(chatId, action) {
  return await bot("sendChatAction", {
    chat_id: chatId,
    action: action
  });
}

async function forwardMessage(kojaShe, azKoja, kodomMsg) {
  return await bot("forwardMessage", {
    chat_id: kojaShe,
    from_chat_id: azKoja,
    message_id: kodomMsg
  });
}

async function editMessageText(chatId, messageId, text, parseMode = null) {
  const payload = {
    chat_id: chatId,
    message_id: messageId,
    text: text
  };
  if (parseMode) {
    payload.parse_mode = parseMode;
  }
  return await bot("editMessageText", payload);
}

app.get("/", (req, res) => {
  res.status(200).send("PHP-converted webhook bot is running on Node.js");
});

app.post("/webhook", async (req, res) => {
  res.status(200).json({ ok: true });

  const update = req.body;
  const message = update && update.message;
  if (!message || !message.chat || !message.from) return;

  const chatId = message.chat.id;
  const messageId = message.message_id;
  const fromId = message.from.id;
  const text = typeof message.text === "string" ? message.text : "";
  const firstName = message.from.first_name || "";
  const name = firstName;

  ensureDir(path.join(DATA_DIR, String(fromId)));

  const ali = readState(fromId);
  const to = readTokenFile(fromId);
  const url = readUrlFile(fromId);

  if (text === "/start") {
    registerMemberIfNew(fromId);

    await sendAction(chatId, "typing");
    await bot("sendMessage", {
      chat_id: chatId,
      text: `• *• سڵاوو بەڕێز ${name}
• بەخێربیت بۆ بۆتی ویب هۆک کردنی 📃
• سرینەوەی ویب هۆک و زانیاری سەر تۆکینت 📝

• 𝐻𝑖. Thank You for using me you can
• make web hook and 
• delete web hook and can you find info  
• about  token bot
﹎﹎﹎﹎﹎﹎﹎﹎﹎﹎﹎﹎*`,
      parse_mode: "MarkDown",
      reply_markup: startMainKeyboard
    });
    return;
  }

  if (text === "گەرانەوە 🔁") {
    writeState(fromId, "no");
    writeTokenFile(fromId, "no");
    writeUrlFile(fromId, "no");

    await sendAction(chatId, "typing");
    await bot("sendMessage", {
      chat_id: chatId,
      text: "• گەرامەوە 💛 بو شاشەی  ☄ رەیسی :-",
      parse_mode: "MarkDown",
      reply_markup: startMainKeyboard
    });

    await bot("sendMessage", {
      chat_id: chatId,
      text: ` * 🐚 ♡︎ 𝐴𝑙𝑙 𝑚𝑦 𝑐ℎ𝑎𝑛𝑛𝑒𝑙𝑠  ♡︎ᵉˢᵒ 🐚

🖤🌻→ @ashqa_kamm → ئـەشـقـەکـەم
🖤🌻→ @Balenakani → بـەڵـێـنـەکـانـی
🖤🌻→ @eso_hawlery → 𝗘𝘀𝗼 𝗛𝗮𝘄𝗹𝗲𝗿𝘆
🖤🌻→ @Xawnak4nm → خـەونـەکـانـم
🖤🌻→ @Elhamakam → ئـیـلـهـامــەکــەم
🖤🌻→ @eso_roberts → 𝗘𝘀𝗼 𝗥𝗼𝗯𝗲𝗿𝘁𝘀
🖤🌻→ @lera_Bbena2 →  سـۆشـیـال مـیـدیـا
🖤🌻→ @Kurd_Musician → گۆرانیەکانی کچێک 
🖤🌻→ @Zheani_kchek → ئـازاری کـچـێـک
🖤🌻→ @Ganjani_emandar → کۆشکی ئیمان 
🖤🌻→ @xorakam →   خـۆرەکـەم
🖤🌻→ @Eso_reklamm → فـری ڕیـکـلام
🖤🌻→ @fxvkk → تـایـبـەت بـەکـچـان
🖤🌻→ @namakann → نـامـەکـان

🖤🌻→ @Eso_it → 🧡 سەروک جەنالەکان 🧡
⁦
 *`,
      parse_mode: "MarkDown",
      reply_to_message_id: messageId
    });
    return;
  }

  if (text === "⚙️ وێب هوک کردن 🛠️") {
    await sendAction(chatId, "typing");
    writeState(fromId, "to");
    await bot("sendMessage", {
      chat_id: chatId,
      text: `• بەڵێ بەرێز ⚡️ ئێستا توکنم بو  بنێرە 📊 •

• Now ⁦♻️⁩ send you a token bot✅`,
      reply_markup: backKeyboard
    });
    return;
  }

  if (ali === "to") {
    const token = text.trim();
    const ali1 = await telegramApiGet(`https://api.telegram.org/bot${token}/getWebhookInfo`);
    const ali2 = await telegramApiGet(`https://api.telegram.org/bot${token}/getMe`);

    const ok = ali2 && ali2.ok === true;
    if (!ok) {
      await sendMessage(chatId, "", null);
    } else {
      writeState(fromId, "url");
      writeTokenFile(fromId, text);
      await sendAction(chatId, "typing");
      await bot("sendMessage", {
        chat_id: chatId,
        text: " بەڵێ بەرێز 🔬 ئێستا 🔖 لینکی  فایلم بو بنێرە 🕸"
      });
    }
    return;
  }

  if (ali === "url") {
    const urlPattern = /\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i;
    if (!urlPattern.test(text)) {
      await sendAction(chatId, "typing");
      await bot("sendMessage", {
        chat_id: chatId,
        text: "ناردنەکەت هەڵە بوو 🚫"
      });
    } else {
      writeState(fromId, "no");
      writeUrlFile(fromId, text);
      await bot("sendMessage", {
        chat_id: chatId,
        text: "• کەمێك چاوەرێ 📡 بکە 🍥 •"
      });
      await sleep(1000);
      await editMessageText(chatId, messageId + 1, "• وا  ⚡️ وێب هوك دەکرێ ⚙ •");
      await editMessageText(
        chatId,
        messageId + 1,
        `• بە سەرکەوتوی 💧 وێب هوک کرا 🍥 •
    
• توکنی بوت 📢 •
    ${to}
• لینکی فایل 🖱 •
    ${text}
    
• ئەم وشەیە لێبدە ⚡️ •
    /eso`
      );
    }
    return;
  }

  if (text === "/eso") {
    if (to && to !== "no") {
      await bot("sendMessage", {
        chat_id: chatId,
        text: "• کەمێك 📡 چاوەرێکە 🍥 •"
      });
      await sleep(1000);
      await editMessageText(chatId, messageId + 1, "• وا رێکی 📡 دەخەم 🍥 •");
      await telegramApiGet(
        `https://api.telegram.org/bot${to}/setWebhook?url=${encodeURIComponent(url)}`
      );
      await sleep(1000);
      await editMessageText(chatId, messageId + 1, "• چاوەرێکە ⚡️ تکایە ⚙ •");
      await sleep(1000);
      writeState(fromId, "no");
      await bot("sendMessage", {
        chat_id: chatId,
        text: "• بە سەرکەوتوی ⚡️ وێب هوک کرا !! 🗒 •",
        parse_mode: "MarkDown",
        reply_markup: afterHookKeyboard
      });
    }
    return;
  }

  if (text === "زانیاری توکن📝🩸") {
    writeState(fromId, "token");
    await sendAction(chatId, "typing");
    await bot("sendMessage", {
      chat_id: chatId,
      text: `• بەڵێ بەرێز ⚡️ ئێستا توکنم بو  بنێرە 📊 •

• Now ⁦♻️⁩ send you a token bot✅`,
      parse_mode: "html",
      reply_markup: backKeyboard
    });
    return;
  }

  if (ali === "token") {
    const token = text.trim();
    const ali1 = await telegramApiGet(`https://api.telegram.org/bot${token}/getWebhookInfo`);
    const ali2 = await telegramApiGet(`https://api.telegram.org/bot${token}/getMe`);

    const ur = (ali1 && ali1.result && ali1.result.url) || "";
    const un = (ali2 && ali2.result && ali2.result.username) || "";
    const fr = (ali2 && ali2.result && ali2.result.first_name) || "";
    const id = (ali2 && ali2.result && ali2.result.id) || "";
    const ok = ali2 && ali2.ok === true;

    if (!ok) {
      await sendMessage(
        chatId,
        `بەرێزەکەم توکنەکەت کێشەی تێدایە 
.! تکایە توکنێکی راست بنێرە 📬`,
        null
      );
    } else {
      writeState(fromId, "no");
      await sendAction(chatId, "typing");
      await bot("sendMessage", {
        chat_id: chatId,
        text: "• کەمێك چاوەرێکە 📡 با ئەنجامی بدەم 🍥 •"
      });
      await sleep(1000);
      await editMessageText(
        chat_id || chatId,
        messageId + 1,
        `*• زانیاری 📬 توکن 💬 • 
• information token bot 

• یوسەرنەیمی بوت  💭• @${un}
• ئـــــــــــایـدی بـوتــ 💛• ${id}
• نـــــــــــــاوی بـوتــ 🌻• ${fr}
• لــــــیـنـکـی فـایـلـ ⁦👁️‍🗨️⁩•*
${ur}
`,
        "MarkDown"
      );
    }
    return;
  }

  if (text === "✂️ سرینەوەی وێب هوک 🗑️") {
    writeState(fromId, "del");
    await sendAction(chatId, "typing");
    await bot("sendMessage", {
      chat_id: chatId,
      text: `• بەڵێ بەرێز ⚡️ ئێستا توکنم بو  بنێرە 📊 •

• Now ⁦♻️⁩ send you a token bot 
Delete web hook✅
`,
      parse_mode: "html",
      reply_markup: backKeyboard
    });
    return;
  }

  if (ali === "del") {
    const token = text.trim();
    const ali2 = await telegramApiGet(`https://api.telegram.org/bot${token}/getMe`);
    const ok = ali2 && ali2.ok === true;

    if (!ok) {
      await sendMessage(
        chatId,
        `بەرێزەکەم توکنەکەت کێشەی تێدایە 
.! تکایە توکنێکی راست بنێرە 📬`,
        null
      );
    } else {
      writeState(fromId, "no");
      await sendAction(chatId, "typing");
      await bot("sendMessage", {
        chat_id: chatId,
        text: "• کەمێك چاوەرێکە 📡 با ئەنجامی بدەم 🍥 •"
      });
      await sleep(1000);
      await editMessageText(chatId, messageId + 1, "• وا ⚡️ دەسرمەوە ⚙ •");
    }

    await telegramApiGet(`https://api.telegram.org/bot${token}/deleteWebhook`);
    await sleep(1000);
    await editMessageText(chatId, messageId + 1, "• بە سەرکەوتوی ⚡️ سرایەوە !! 🗒 •");
    await sleep(1000);
    writeState(fromId, "no");
    await bot("sendMessage", {
      chat_id: chatId,
      text: "• بە سەرکەوتوی 💧 گەرامەوە ☄ شاشەی رەیسی :-",
      parse_mode: "MarkDown",
      reply_markup: afterDelKeyboard
    });
    return;
  }

  if (text === "/yusif" && String(chatId) === String(ADMIN_ID)) {
    await sendAction(chatId, "typing");
    await bot("sendMessage", {
      chat_id: chatId,
      text: "اعزيزي المشرف، مرحبا بك في لوحة مشرف الروبوت 🌿",
      parse_mode: "html",
      reply_markup: adminPanelKeyboard
    });
    return;
  }

  if (text === "عدد اعضاء البوت 👬" && String(chatId) === String(ADMIN_ID)) {
    await sendAction(chatId, "typing");
    const memberIds = getMembersList();
    const memberCount = memberIds.length;
    await sendMessage(chatId, ` عدد الاعضاء البوت : ${memberCount} `, "html");
    return;
  }

  if (text === "رسالة للمشتركين 📄" && String(chatId) === String(ADMIN_ID)) {
    writeState(fromId, "send");
    await sendAction(chatId, "typing");
    await bot("sendMessage", {
      chat_id: chatId,
      text: "ارسل الرسالة التي تريد ارسالها بتنسيق نصي 📝",
      parse_mode: "html",
      reply_markup: adminBackKeyboard
    });
    return;
  }

  if (ali === "send" && String(chatId) === String(ADMIN_ID)) {
    writeState(fromId, "no");
    await sendAction(chatId, "typing");
    await bot("sendMessage", {
      chat_id: chatId,
      text: "تم إرسال رسالة عامة 🎉"
    });
    const members = getMembersList();
    for (const user of members) {
      await sendMessage(user, text, "html");
    }
    return;
  }

  if (text === "توجيه للمشتركين 💎" && String(chatId) === String(ADMIN_ID)) {
    writeState(fromId, "fwd");
    await sendAction(chatId, "typing");
    await bot("sendMessage", {
      chat_id: chatId,
      text: "نشر توجيهك 👣",
      parse_mode: "html",
      reply_markup: adminBackKeyboard
    });
    return;
  }

  if (ali === "fwd" && String(chatId) === String(ADMIN_ID)) {
    writeState(fromId, "no");
    await sendAction(chatId, "typing");
    await bot("sendMessage", {
      chat_id: chatId,
      text: "استمرار 🍁"
    });
    const members = getMembersList();
    for (const fakar of members) {
      await forwardMessage(fakar, chatId, messageId);
    }
    await bot("sendMessage", {
      chat_id: chatId,
      text: "تم نشر توجيهك بنجاح 🌟"
    });
    return;
  }

  if (text === "💛 بـۆتـەکـان 🧡") {
    await bot("sendMessage", {
      chat_id: chatId,
      text: `ئێرە داگرە بۆ بینی سەرجەم بۆتەکان 💛
https://t.me/ashqa_kamm/3618 🧡
`,
      reply_to_message_id: messageId
    });
    return;
  }

  if (text === "گەڕانەوە 🔁") {
    await bot("sendMessage", {
      chat_id: chatId,
      text: ` * 
˹𝐀𝐥𝐥 𝐦𝐲 𝐁𝐨𝐭𝐬.˼ 💗ᵉˢᵒ

👒→ @Grup_JoinBot → زیاد کردنی ئەندام
👒→ @Esodelete_AcBot → داخستنی تلیگرام
👒→ @Protect_ChannelBot → پاراستنی کەناڵ
👒→ @EsoReklamBot → ڕیکلامی خۆڕایی
👒→ @Eso_name_bot → زەخرەفەی ناوی ئینگلیزی
👒→ @Web_3HookBot → ویب هۆک
👒→ @GrupHilp_bot → پاراستنی گرووپ 
👒→ @NamayNheni_bot → بۆتی نامەی نەهێنی
👒→ @EsoJoinbot → زیادکردنی ئەندام
👒→ @FileGorenBot → گۆڕینی ڤیدیۆ و گۆرانی
👒→ @MrPubge_bot →  یاری پـۆبـجـی 
👒→ @DDFYHH_bot → دانانی لینکی کەناڵت بۆ پۆست
👒→ @Zkr_Grup_Bot → زکرەکانی گروپ
👒→ @EEQuran_bot →  قورئانی پیرۆز 
👒→ @Quran07_bot → زکر و سوننەت
👒→ @PhotoQuran_bot → لاپەڕەکانی قورئان
👒→ @apk_dowlond_bot →  دابەزاندنی بەرنامە
👒→ @fotoshop3Bot → فۆتۆشۆپ
👒→ @MrDate_bot → بەروار و مێژوو
👒→ @NemaEso_BOT → هەموو کارێکی دیزاین
👒→ @zaxrafaEso_bot → ڕازاندنەوەی وێنە
👒→ @Chanal_ID_bot → دەرهێنانی ئایدی
👒→ @EsoButton_Bot →  بۆتی بەروار بۆ جەنال
👒→ @EEYouTube_bot → دابەزاندن لە یوتوبەوە
👒→ @MrEso_FolowrsBot → زیاد کردنی ڤۆڵۆی انساگرام
👒→ @krdish_nemBot → ناوی کوردی چاک بکە
👒→ @Bio_insta2_bot → بایوی انساگرام
👒→ @editroKurd_Bot → خۆت فێری ئیدید بکە
👒→ @MotherLania_bot → دایـکـی لـەنـیـا 🤍💍

👒→ @eso_roberts - کەناڵی بۆتەکانم 🧡
👒→ @eso_hawlery - کەناڵی بۆتەکانم 🧡
👒→ @Elhamakam - کەناڵی بۆتەکانم 🧡 *`,
      parse_mode: "MarkDown",
      reply_to_message_id: messageId
    });
  }
});

app.listen(PORT, () => {
  console.log(`Converted PHP webhook bot listening on port ${PORT}`);
});
