import { apiFetch } from "./api";
import { JSONContent } from "@tiptap/react";

export interface BaseBlock {
  id: string;
  type: string;
}

export interface TextBlock extends BaseBlock {
  type: "text";
  content: string;
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  url: string;
  alt?: string;
}

export type ContentBlock = TextBlock | ImageBlock;

export interface Todo {
  todo_id: number;
  title: string;
  done: boolean;
}

export interface Item {
  item_id: number;
  name: string;
  content: JSONContent;
  role: "viewer" | "editor" | "owner";
  version: number;
}

export interface ApiError extends Error {
  message: string;
  status?: number;
}

export const fetchItems = async (): Promise<Item[]> => {
  return apiFetch("/api/items");
};

export const fetchItemById = async (itemId: number): Promise<Item> => {
  const response = await apiFetch(`/api/items/${itemId}`);
  return {
    ...response,
    role: response.role || "owner",
  };
};

export const addItem = async (name: string, content: JSONContent) => {
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
  content: JSONContent,
  version: number
) => {
  return apiFetch(`/api/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ name, content, version }),
  });
};

export const deleteItem = async (itemId: number) => {
  return apiFetch(`/api/items/${itemId}`, {
    method: "DELETE",
  });
};

export const shareItem = async (
  itemId: number,
  userId: number,
  role: "editor" | "viewer"
) => {
  return apiFetch(`/api/items/${itemId}/share`, {
    method: "POST",
    body: JSON.stringify({ user_id: userId, role }),
  });
};

export const lookupUser = async (email: string) => {
  return apiFetch(`/api/users/lookup?email=${email}`);
};
