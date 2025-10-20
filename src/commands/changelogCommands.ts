import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { createList, getAllCards, updateList } from "../utils/trello.js";

export const GenerateChangeLog = {
  data: new SlashCommandBuilder()
    .setName("gcl")
    .setDescription("Gera um novo changelog")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const listUpdated = await updateList();

      if (!listUpdated) {
        await interaction.reply("Erro ao atualizar lista");
      }

      const newList = await createList();

      if (!newList) {
        await interaction.reply("Erro ao criar nova lista");
      }

      const cards = await getAllCards(listUpdated.id);

      const changelog = cards
        .map((card, index) => `🟢 **${index + 1}. ${card.name}**\n${card.desc}`)
        .join("\n\n");

      const message = `>>> **🧾 Changelog - Últimas atualizações:**\n\n${changelog}`;

      await interaction.reply(message);
    } catch (err) {
      console.error(err);
      await interaction.reply("**❌ 𝗘𝗿𝗿𝗼 **");
    }
  },
};
