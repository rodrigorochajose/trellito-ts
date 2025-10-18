import axios from "axios";
import { TrelloList } from "../interfaces/trelloList.js";
import { TrelloCard } from "../interfaces/trelloCard.js";

export let lists: TrelloList[] = [];

export async function loadLists() {
  const response = await axios.get<TrelloList[]>(
    `https://api.trello.com/1/boards/80CRdN7z/lists?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
    {
      params: { fields: "name" },
    }
  );
  lists = response.data;
}

export async function getCard(cardId: string) {
  const response = await axios.get<TrelloCard>(
    `https://api.trello.com/1/cards/${cardId}?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}&fields=id,name,desc`
  );

  return response.data;
}

export async function getAllCards(listId: string) {
  const response = await axios.get<TrelloCard[]>(
    `https://api.trello.com/1/lists/${listId}/cards?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}&fields=id,name,desc`
  );

  return response.data;
}

export function createCard(idList: string, name: string, desc: string) {
  return axios.post("https://api.trello.com/1/cards", null, {
    params: {
      key: process.env.TRELLO_KEY,
      token: process.env.TRELLO_TOKEN,
      idList,
      name,
      desc: `${desc}\n\n`,
    },
  });
}
