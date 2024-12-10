export const fetchTodos = async () => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/todos`);
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }
  return response.json();
};
