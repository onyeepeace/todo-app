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
  etag?: string;
}

export interface ApiError extends Error {
  message: string;
  status?: number;
}

interface ApiResponse<T> {
  data: T;
  etag: string;
}

export const fetchItems = async (): Promise<Item[]> => {
  const response = await apiFetch("/api/items");
  if ("data" in response) {
    const apiResponse = response as ApiResponse<Omit<Item, "etag">[]>;
    return apiResponse.data.map((item) => ({
      ...item,
      role: item.role || "owner",
      etag: apiResponse.etag,
    }));
  }
  // Handle legacy response format
  return response;
};

export const fetchItemById = async (itemId: number): Promise<Item> => {
  const response = await apiFetch(`/api/items/${itemId}`);

  // Check if we have a data property
  if ("data" in response) {
    // Even if we don't have an etag, we should still return the data
    const item = {
      ...response.data,
      role: response.data.role || "owner",
      etag: response.etag || response.data.etag, // Try both locations
    };
    return item;
  }

  // Handle legacy response format
  return {
    ...response,
    role: response.role || "owner",
    etag: response.etag, // Try to get etag from root level
  };
};

export const addItem = async (
  name: string,
  content: JSONContent
): Promise<Item> => {
  const response = await apiFetch("/api/items", {
    method: "POST",
    body: JSON.stringify({ name, content }),
  });
  if ("data" in response) {
    const apiResponse = response as ApiResponse<Omit<Item, "etag">>;
    return {
      ...apiResponse.data,
      role: apiResponse.data.role || "owner",
      etag: apiResponse.etag,
    };
  }
  // Handle legacy response format
  return response;
};

export const fetchTodos = async (itemId: number): Promise<Todo[]> => {
  return apiFetch(`/api/items/${itemId}/todos`);
};

export const editItem = async (
  itemId: number,
  name: string,
  content: JSONContent,
  etag: string
): Promise<Item> => {
  const response = await apiFetch(`/api/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ name, content }),
    etag,
  });
  if ("data" in response) {
    const apiResponse = response as ApiResponse<Omit<Item, "etag">>;
    return {
      ...apiResponse.data,
      role: apiResponse.data.role || "owner",
      etag: apiResponse.etag,
    };
  }
  // Handle legacy response format
  return response;
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
  const response = await apiFetch(`/api/items/${itemId}/share`, {
    method: "POST",
    body: JSON.stringify({ user_id: userId, role }),
  });
  return response.data;
};

export const lookupUser = async (email: string) => {
  return apiFetch(`/api/users/lookup?email=${email}`);
};
