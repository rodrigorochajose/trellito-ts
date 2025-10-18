import { Client, TextChannel } from "discord.js";
import { TrelloCard } from "../interfaces/trelloCard.js";

export default async function sendMessage(
  client: Client,
  card: TrelloCard,
  channelId: string | undefined
) {
  if (channelId) {
    const channel = (await client.channels.fetch(channelId)) as TextChannel;

    let status = "";
    let extraInfo = "";

    if (channel.name.includes("Novo")) {
      status = "ᴄʀɪᴀᴅᴏ 💡";
      extraInfo = `[𝗔𝗰𝗲𝘀𝘀𝗲 𝗮𝗾𝘂𝗶 - 𝗦𝘁𝗮𝗳𝗳](${card.link})\n`;
    } else if (channel.name.includes("Fazendo")) {
      status = "ғᴀᴢᴇɴᴅᴏ 🕹️";
    } else if (channel.name.includes("Validação")) {
      status = "ᴠᴀʟɪᴅᴀᴄᴀᴏ 👀";
    } else {
      status = "ʀᴇsᴏʟᴠɪᴅᴏ 👌";
    }

    const message =
      `>>> ## 𝗖𝗮𝗿𝗱 ➨ **${card.name}**\n\n` +
      `𝗦𝘁𝗮𝘁𝘂𝘀 : **${status}**\n` +
      `𝗗𝗲𝘀𝗰𝗿𝗶𝗰𝗮𝗼 :\n` +
      `\`\`\`\n${card.desc || "Sem descrição"}\n\`\`\`\n` +
      `${extraInfo}`;

    channel.send(message);
  } else {
    console.log("Canal não encontrado.");
  }
}
