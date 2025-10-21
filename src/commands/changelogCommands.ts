import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { createList, getAllCards, lists, updateList } from "../utils/trello.js";

export const GenerateChangeLog = {
  data: new SlashCommandBuilder()
    .setName("gcl")
    .setDescription("Gera um novo changelog")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const listToUpdate = lists.find((e) => e.name == "Finalizado");

      if (!listToUpdate) {
        await interaction.reply("## ❌ 𝗘𝗿𝗿𝗼 𝗮𝗼 𝗼𝗯𝘁𝗲𝗿 𝗮 𝗹𝗶𝘀𝘁𝗮 𝘀𝗲𝗹𝗲𝗰𝗶𝗼𝗻𝗮𝗱𝗮.");
        return;
      }

      const cards = await getAllCards(listToUpdate.id);

      if (cards.length > 0) {
        await updateList(listToUpdate.id);

        await createList();

        const changelog = cards
          .map(
            (card, index) => `🟢 **${index + 1}. ${card.name}**\n${card.desc}`
          )
          .join("\n\n");

        const message = `>>> **🧾 Changelog - Últimas atualizações:**\n\n${changelog}`;

        await interaction.reply(message);
        return;
      }

      await interaction.reply("## ❌ 𝗟𝗶𝘀𝘁𝗮 '𝗙𝗶𝗻𝗮𝗹𝗶𝘇𝗮𝗱𝗼' 𝘀𝗲 𝗲𝗻𝗰𝗼𝗻𝘁𝗿𝗮 𝘃𝗮𝘇𝗶𝗮");
    } catch (err) {
      console.error(err);
      await interaction.reply("❌ 𝗘𝗿𝗿𝗼");
    }
  },
};
