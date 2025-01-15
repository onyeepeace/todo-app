import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "@/lib/constants";
import { SquareCheck } from "lucide-react";

export interface Todo {
  todo_id: number;
  title: string;
  body: string;
  done: boolean;
}

const SharedItem = ({ activeItemId }: { activeItemId: number }) => {
  const {
    data: todos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos", activeItemId],
    queryFn: () => fetchTodos(activeItemId),
    enabled: !!activeItemId,
  });

  if (isLoading) {
    return <p>Loading todos...</p>;
  }

  if (isError) {
    return <p>Error loading todos. Please try again later.</p>;
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <ul className="list-none">
        {todos
          ? todos.map((todo: Todo) => (
              <li
                key={`todo_list__${todo.todo_id}`}
                className="flex justify-between mb-4 gap-4"
              >
                <div className="flex items-center gap-6 text-xl">
                  {todo.done ? (
                    <SquareCheck className="text-teal-500 size-9" />
                  ) : (
                    <SquareCheck className="text-gray-500 cursor-pointer size-9" />
                  )}
                  {todo.title}
                </div>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

export default SharedItem;
