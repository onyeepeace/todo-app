import { apiFetch } from "./api";

export const fetchLists = async () => {
  return apiFetch("/api/lists");
};

export const fetchListById = async (listId: number) => {
  return apiFetch(`/api/lists/${listId}`);
};

export const addList = async ({ name }: { name: string }) => {
  return apiFetch("/api/lists", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
};

export const fetchTodos = async (listId: number) => {
  return apiFetch(`/api/lists/${listId}/todos`);
};

export const editList = async ({
  name,
  listId,
}: {
  name: string;
  listId: number;
}) => {
  return apiFetch(`/api/lists/${listId}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
};

export const deleteList = async (listId: number) => {
  return apiFetch(`/api/lists/${listId}`, {
    method: "DELETE",
  });
};
