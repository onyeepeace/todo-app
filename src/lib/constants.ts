const URL = import.meta.env.VITE_BASE_URL;

export const fetchLists = async () => {
  const response = await fetch(`${URL}/api/lists`);
  if (!response.ok) {
    throw new Error("Failed to fetch lists");
  }
  return response.json();
};

export const fetchListById = async (listId: number) => {
  const response = await fetch(`${URL}/api/lists/${listId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch lists");
  }
  return response.json();
};

export const addList = async ({ name }: { name: string }) => {
  const response = await fetch(`${URL}/api/lists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error("Failed to edit list");
  }
  return response.json();
};

export const fetchTodos = async (listId: number) => {
  const response = await fetch(`${URL}/api/lists/${listId}/todos`);

  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }
  return response.json();
};

export const editList = async ({
  name,
  listId,
}: {
  name: string;
  listId: number;
}) => {
  const response = await fetch(`${URL}/api/lists/${listId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error("Failed to edit list");
  }
  return response.json();
};

export const deleteList = async (listId: number) => {
  const response = await fetch(`${URL}/api/lists/${listId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete list");
  }
  return response.json();
};
