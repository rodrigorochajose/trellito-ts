import { Router } from "express";
import express from "express";
import type { Request, Response } from "express";
import sendMessage from "./utils/sendMessage.js";
import { Client } from "discord.js";
import { getCard } from "./utils/trello.js";
import { DSChannel } from "./utils/enumDSChannel.js";

const processedActions = new Set<string>();

export default function configWebHook(client: Client) {
  const routes = Router();

  routes.all("/card-changed", async (req: Request, res: Response) => {
    res.status(200).send("OK");

    const action = req.body.action;
    const actionId = action.id;
    const listAfter = action.data?.listAfter?.name;
    const cardId = action.data?.card?.id;

    if (!actionId || !cardId || !listAfter) return;

    if (processedActions.has(actionId)) return;

    processedActions.add(actionId);

    if (action.type === "updateCard") {
      let channel;

      switch (listAfter) {
        case "Fazendo":
          channel = DSChannel.Fazendo;
          break;
        case "Validação":
          channel = DSChannel.Validacao;
          break;
        case "Finalizado":
          channel = DSChannel.Finalizado;
          break;
        default:
          return;
      }

      const card = await getCard(cardId);

      sendMessage(client, card, channel);
    }
  });

  const app = express();

  app.use(express.json());
  app.use(routes);

  app.listen(8080, () => {
    console.log(`Server is running on 8080`);
  });
}
