export const ENDPOINT = "http://localhost:4000";

export const fetchTodos = async () => {
  const response = await fetch(`${ENDPOINT}/api/todos`);
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }
  return response.json();
};
