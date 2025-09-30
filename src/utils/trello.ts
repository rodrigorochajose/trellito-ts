import axios from "axios";

export interface TrelloList {
  id: string;
  name: string;
}

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

export function createCard(idList: string, name: string, desc: string) {
  return axios.post("https://api.trello.com/1/cards", null, {
    params: {
      key: process.env.TRELLO_KEY,
      token: process.env.TRELLO_TOKEN,
      idList,
      name,
      desc: `${desc}\n\nCriado via Trellito.`,
    },
  });
}
