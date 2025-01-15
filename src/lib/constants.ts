import { apiFetch } from "./api";
import { Delta } from "quill";

export interface TextBlock {
  id: string;
  type: "text";
  data: {
    delta: Delta;
  };
}

export interface ChecklistBlock {
  id: string;
  type: "checklist";
  data: {
    items: {
      id: string;
      text: string;
      done: boolean;
    }[];
  };
}

export interface ImageBlock {
  id: string;
  type: "image";
  data: {
    url: string;
    alt?: string;
  };
}

export interface Todo {
  todo_id: number;
  title: string;
  body: string;
  done: boolean;
}

export type ContentBlock = TextBlock | ChecklistBlock | ImageBlock;

export interface Item {
  item_id: number;
  name: string;
  content: ContentBlock[];
}

export const fetchItems = async (): Promise<Item[]> => {
  return apiFetch("/api/items");
};

export const fetchItemById = async (itemId: number): Promise<Item> => {
  return apiFetch(`/api/items/${itemId}`);
};

export const addItem = async (name: string, content: ContentBlock[]) => {
  return apiFetch("/api/items", {
    method: "POST",
    body: JSON.stringify({ name, content }),
  });
};

export const fetchTodos = async (itemId: number): Promise<Todo[]> => {
  return apiFetch(`/api/items/${itemId}/todos`);
};

export const editItem = async (
  itemId: number,
  name: string,
  content: ContentBlock[]
) => {
  return apiFetch(`/api/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ name, content }),
  });
};

export const deleteItem = async (itemId: number) => {
  return apiFetch(`/api/items/${itemId}`, {
    method: "DELETE",
  });
};
