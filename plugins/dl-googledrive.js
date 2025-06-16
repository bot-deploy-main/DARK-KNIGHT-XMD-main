const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "gdrive",
  alias: ["gdrivedownload", "gdownloader"],
  react: '📥',
  desc: "Download files from Google Drive.",
  category: "download",
  use: ".gdrive <Google Drive URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    // Check if the user provided a Google Drive URL
    const gdriveUrl = args[0];
    if (!gdriveUrl || !gdriveUrl.includes("drive.google.com")) {
      return reply('Please provide a valid Google Drive URL. Example: `.gdrive https://drive.google.com/...`');
    }

    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the NexOracle API URL
    const apiUrl = `https://api.nexoracle.com/downloader/gdrive`;
    const params = {
      apikey: 'free_key@maher_apis', // Replace with your API key if needed
      url: gdriveUrl, // Google Drive URL
    };

    // Call the NexOracle API using GET
    const response = await axios.get(apiUrl, { params });

    // Check if the API response is valid
    if (!response.data || response.data.status !== 200 || !response.data.result) {
      return reply('❌ Unable to fetch the file. Please check the URL and try again.');
    }

    // Extract the file details
    const { downloadUrl, fileName, fileSize, mimetype } = response.data.result;

    // Inform the user that the file is being downloaded
    await reply(`📥 *Downloading ${fileName} (${fileSize})... Please wait.*`);

    // Download the file
    const fileResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
    if (!fileResponse.data) {
      return reply('❌ Failed to download the file. Please try again later.');
    }

    // Prepare the file buffer
    const fileBuffer = Buffer.from(fileResponse.data, 'binary');

    // Send the file based on its MIME type
    if (mimetype.startsWith('image')) {
      // Send as image
      await conn.sendMessage(from, {
        image: fileBuffer,
        caption: `📥 *ғɪʟᴇ ᴅᴇᴛᴀɪʟs* 📥\n\n` +
          `🔖 *Nᴀᴍᴇ*: ${fileName}\n` +
          `📏 *Sɪᴢᴇ*: ${fileSize}\n\n` +
          `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ᴍᴀʟᴠɪɴ ᴋɪɴɢ`,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363398430045533@newsletter',
            newsletterName: '『 ✦ᴍᴀʟᴠɪɴ xᴅ v3✦ 』',
            serverMessageId: 143
          }
        }
      }, { quoted: mek });
    } else if (mimetype.startsWith('video')) {
      // Send as video
      await conn.sendMessage(from, {
        video: fileBuffer,
        caption: `📥 *ғɪʟᴇ ᴅᴇᴛᴀɪʟs* 📥\n\n` +
          `🔖 *Nᴀᴍᴇ*: ${fileName}\n` +
          `📏 *Sɪᴢᴇ*: ${fileSize}\n\n` +
          `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ᴍᴀʟᴠɪɴ ᴋɪɴɢ`,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363398430045533@newsletter',
            newsletterName: '『 ᴍᴀʟᴠɪɴ-xᴅ 』',
            serverMessageId: 143
          }
        }
      }, { quoted: mek });
    } else {
      // Send as document
      await conn.sendMessage(from, {
        document: fileBuffer,
        mimetype: mimetype,
        fileName: fileName,
        caption: `📥 *ғɪʟᴇ ᴅᴇᴛᴀɪʟs* 📥\n\n` +
          `🔖 *Nᴀᴍᴇ*: ${fileName}\n` +
          `📏 *Sɪᴢᴇ*: ${fileSize}\n\n` +
          `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ᴍᴀʟᴠɪɴ ᴋɪɴɢ`,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363398430045533@newsletter',
            newsletterName: '『 ᴍᴀʟᴠɪɴ-xᴅ 』',
            serverMessageId: 143
          }
        }
      }, { quoted: mek });
    }

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading file:', error);
    reply('❌ Unable to download the file. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});

cmd({
  pattern: "gdrive2",
  desc: "Download Google Drive files.",
  react: "🌐",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide a valid Google Drive link.");
    }

    await conn.sendMessage(from, { react: { text: "⬇️", key: m.key } });

    const apiUrl = `https://api.fgmods.xyz/api/downloader/gdrive?url=${q}&apikey=mnp3grlZ`;
    const response = await axios.get(apiUrl);
    const downloadUrl = response.data.result.downloadUrl;

    if (downloadUrl) {
      await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

      await conn.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: response.data.result.mimetype,
        fileName: response.data.result.fileName,
        caption: "*© Powered By JawadTechX*"
      }, { quoted: m });

      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
    } else {
      return reply("⚠️ No download URL found. Please check the link and try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the Google Drive file. Please try again.");
  }
});
