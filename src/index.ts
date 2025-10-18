import { Client, GatewayIntentBits } from "discord.js";
import { configDotenv } from "dotenv";
import { registerCommands, commandMap } from "./commands/index.js";
import { loadLists } from "./utils/trello.js";
import configWebHook from "./webhook.js";

configDotenv();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

configWebHook(client);

client.once("clientReady", async () => {
  console.log(`🤖 Bot online: ${client.user?.tag}`);

  await loadLists();
  console.log("✅ Listas do Trello carregadas!");

  await registerCommands(
    process.env.DISCORD_TOKEN!,
    process.env.CLIENT_ID!,
    process.env.GUILD_ID!
  );
  console.log("✅ Comandos registrados!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commandMap.get(interaction.commandName);
  if (!command) {
    await interaction.reply("⁉️ *Comando desconhecido*");
    return;
  }

  try {
    await command.execute(interaction, client);
  } catch (err) {
    console.error(err);
    await interaction.reply("❌ Erro ao executar comando.");
  }
});

client.login(process.env.DISCORD_TOKEN);
