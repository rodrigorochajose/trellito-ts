import { REST, Routes, Collection } from "discord.js";
import { command as CreateCard } from "./createCard.js";

export const commands = [CreateCard];

export async function registerCommands(
  token: string,
  clientId: string,
  guildId: string
) {
  const rest = new REST({ version: "10" }).setToken(token);
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commands.map((c) => c.data.toJSON()),
  });
}

export const commandMap = new Collection<string, typeof CreateCard>(
  commands.map((c) => [c.data.name, c])
);
