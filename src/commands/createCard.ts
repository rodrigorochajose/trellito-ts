import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { createCard, lists } from "../utils/trello.js";

export const command = {
  data: new SlashCommandBuilder()
    .setName("ccard")
    .setDescription("Cria um card no Trello NLOST")
    .addStringOption((option) =>
      option
        .setName("list")
        .setDescription("Lista")
        .setRequired(true)
        .setChoices(
          { name: "Bugs", value: "Backlog - Bugs / Ausência" },
          { name: "Features", value: "Backlog - Features / Updates" }
        )
    )
    .addStringOption((option) =>
      option.setName("name").setDescription("Nome do card").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("desc").setDescription("Descrição do card")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const listName = interaction.options.getString("list", true);
    const cardName = interaction.options.getString("name", true);
    const cardDesc = interaction.options.getString("desc") ?? "";

    const selectedList = lists.find((l) => l.name === listName);
    if (!selectedList) {
      await interaction.reply("❌ Lista não encontrada!");
      return;
    }

    try {
      const card = await createCard(selectedList.id, cardName, cardDesc);
      await interaction.reply(`✅ Card criado: ${card.data.shortUrl}`);
    } catch (err) {
      console.error(err);
      await interaction.reply("❌ Erro ao criar o card.");
    }
  },
};
