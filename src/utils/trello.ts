import axios from "axios";
import { TrelloList } from "../interfaces/trelloList.js";
import { TrelloCard } from "../interfaces/trelloCard.js";
import { formatDate } from "./dateUtils.js";

export let lists: TrelloList[] = [];

async function getBoardId() {
  const response = await axios.get(
    `https://api.trello.com/1/boards/80CRdN7z?fields=id&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
  );

  return response.data.id;
}

export async function createList() {
  const boardId = await getBoardId();
  const validationList = lists.find((e) => e.name == "Validação");

  if (!validationList) return;

  const response = await axios.post(
    `https://api.trello.com/1/lists?name=Finalizado&idBoard=${boardId}&pos=${validationList.pos}&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
  );

  return response.data;
}

export async function updateList(listId: string) {
  const newName = `ChangeLog-${formatDate(new Date().toString())}`;

  const response = await axios.put(
    `https://api.trello.com/1/lists/${listId}?name=${newName}&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
  );

  return response.data;
}

export async function loadLists() {
  const response = await axios.get<TrelloList[]>(
    `https://api.trello.com/1/boards/80CRdN7z/lists?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
    {
      params: { fields: ["name", "pos"] },
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

export async function createCard(idList: string, name: string, desc: string) {
  return await axios.post("https://api.trello.com/1/cards", null, {
    params: {
      key: process.env.TRELLO_KEY,
      token: process.env.TRELLO_TOKEN,
      idList,
      name,
      desc: `${desc}\n\n`,
    },
  });
}
