import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ComponentType,
  PermissionsBitField,
  MessageFlags,
} from "discord.js";
import { createCard, getAllCards, lists } from "../utils/trello.js";
import sendMessage from "../utils/sendMessage.js";
import { DSChannel } from "../utils/enumDSChannel.js";
import { TrelloCard } from "../interfaces/trelloCard.js";

export const CreateCardCommand = {
  data: new SlashCommandBuilder()
    .setName("ccard")
    .setDescription("Cria um card no Trello NLOST")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
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

  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    const listName = interaction.options.getString("list", true);
    const cardName = interaction.options.getString("name", true);
    const cardDesc = interaction.options.getString("desc") ?? "";

    const selectedList = lists.find((l) => l.name === listName);
    if (!selectedList) {
      await interaction.reply("## ❌ 𝗟𝗶𝘀𝘁𝗮 𝗻𝗮𝗼 𝗲𝗻𝗰𝗼𝗻𝘁𝗿𝗮𝗱𝗮");
      return;
    }

    try {
      const card = await createCard(selectedList.id, cardName, cardDesc);

      const newCard: TrelloCard = {
        name: cardName,
        desc: cardDesc,
        link: card.data.shortUrl,
      };

      sendMessage(client, newCard, DSChannel.Novo);

      await interaction.reply(`## **𝗖𝗮𝗿𝗱 𝗖𝗿𝗶𝗮𝗱𝗼 ➨** ${card.data.name}`);
    } catch (err) {
      console.error(err);
      await interaction.reply("## ❌ 𝗘𝗿𝗿𝗼 𝗮𝗼 𝗰𝗿𝗶𝗮𝗿 𝗼 𝗖𝗮𝗿𝗱");
    }
  },
};

export const GetAllCardsCommand = {
  data: new SlashCommandBuilder()
    .setName("gcards")
    .setDescription("Retorna todos os cards de uma lista")
    .addStringOption((option) =>
      option
        .setName("list")
        .setDescription("Lista")
        .setRequired(true)
        .setChoices(
          { name: "Bugs", value: "Backlog - Bugs / Ausência" },
          { name: "Features", value: "Backlog - Features / Updates" },
          { name: "Fazendo", value: "Fazendo" },
          { name: "Validação", value: "Validação" },
          { name: "Finalizado", value: "Finalizado" }
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.channelId != process.env.CHANNEL_INTERACTION || "") {
      await interaction.reply({
        content: "## 🚫 𝗘𝘀𝘁𝗲 𝗰𝗼𝗺𝗮𝗻𝗱𝗼 𝗻𝗮𝗼 𝗽𝗼𝗱𝗲 𝘀𝗲𝗿 𝘂𝘀𝗮𝗱𝗼 𝗻𝗲𝘀𝘁𝗲 𝗰𝗮𝗻𝗮𝗹.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const listName = interaction.options.getString("list", true);

    const selectedList = lists.find((l) => l.name === listName);
    if (!selectedList) {
      await interaction.reply("## ❌ 𝗟𝗶𝘀𝘁𝗮 𝗻𝗮𝗼 𝗲𝗻𝗰𝗼𝗻𝘁𝗿𝗮𝗱𝗮");
      return;
    }

    try {
      const cards = await getAllCards(selectedList.id);

      if (!cards || cards.length === 0) {
        await interaction.reply("## 📭 𝗡𝗲𝗻𝗵𝘂𝗺 𝗰𝗮𝗿𝗱 𝗲𝗻𝗰𝗼𝗻𝘁𝗿𝗮𝗱𝗼 𝗻𝗲𝘀𝘁𝗮 𝗹𝗶𝘀𝘁𝗮.");
        return;
      }

      const itemsPerPage = 3;
      const totalPages = Math.ceil(cards.length / itemsPerPage);
      let currentPage = 0;

      const generateEmbed = (page: number) => {
        const start = page * itemsPerPage;
        const pageItems = cards.slice(start, start + itemsPerPage);

        const description = pageItems
          .map((c, i) => {
            const cardDesc = c.desc || "Descrição indisponível";
            return `**### ✦ ${c.name} **\`\`\`\n${cardDesc}\n\`\`\``;
          })
          .join("\n");

        return new EmbedBuilder()
          .setColor("#ffffff")
          .setTitle(`📋 Cards da Lista :  ${listName}`)
          .setDescription(description)
          .setFooter({
            text: `Página ${page + 1}/${totalPages} — Total: ${cards.length}`,
          });
      };

      const getRow = (page: number) =>
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("first")
            .setEmoji("⏪")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page === 0),
          new ButtonBuilder()
            .setCustomId("prev")
            .setEmoji("◀️")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page === 0),
          new ButtonBuilder()
            .setCustomId("next")
            .setEmoji("▶️")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page === totalPages - 1),
          new ButtonBuilder()
            .setCustomId("last")
            .setEmoji("⏩")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page === totalPages - 1)
        );

      await interaction.reply({
        embeds: [generateEmbed(currentPage)],
        components: totalPages > 1 ? [getRow(currentPage)] : [],
      });

      const message = await interaction.fetchReply();

      if (totalPages > 1) {
        const collector = message.createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: 120000,
        });

        collector.on("collect", async (i) => {
          if (i.user.id !== interaction.user.id) {
            await i.reply({
              content: "## 🚫 𝗔𝗽𝗲𝗻𝗮𝘀 𝗾𝘂𝗲𝗺 𝘂𝘀𝗼𝘂 𝗼 𝗰𝗼𝗺𝗮𝗻𝗱𝗼 𝗽𝗼𝗱𝗲 𝗶𝗻𝘁𝗲𝗿𝗮𝗴𝗶𝗿.",
              ephemeral: true,
            });
            return;
          }

          if (i.customId === "first") currentPage = 0;
          if (i.customId === "prev" && currentPage > 0) currentPage--;
          if (i.customId === "next" && currentPage < totalPages - 1)
            currentPage++;
          if (i.customId === "last") currentPage = totalPages - 1;

          await i.update({
            embeds: [generateEmbed(currentPage)],
            components: [getRow(currentPage)],
          });
        });

        collector.on("end", async () => {
          await message.edit({ components: [] }).catch(() => {});
        });
      }
    } catch (err) {
      console.error(err);
      await interaction.reply("## ❌ 𝗘𝗿𝗿𝗼 𝗮𝗼 𝗿𝗲𝘀𝗴𝗮𝘁𝗮𝗿 𝗼𝘀 𝗰𝗮𝗿𝗱𝘀");
    }
  },
};
