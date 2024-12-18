import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodos } from "@/lib/constants";
import AddTodo from "./AddTodo";
import EditTodo from "./EditTodo";

export interface Todo {
  todo_id: number;
  title: string;
  body: string;
  done: boolean;
}

const Todo = ({ activeListId }: { activeListId: number }) => {
  const queryClient = useQueryClient();

  const {
    data: todos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos", activeListId],
    queryFn: () => fetchTodos(activeListId),
    enabled: !!activeListId,
  });

  const markTodoAsDone = useMutation<void, Error, number>({
    mutationFn: (todo_id: number) =>
      fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/lists/${activeListId}/todos/${todo_id}/done`,
        {
          method: "PATCH",
        }
      ).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to mark todo as done");
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      console.error("Error marking todo as done:", error.message);
    },
  });

  const deleteTodo = useMutation<void, Error, number>({
    mutationFn: (todo_id: number) =>
      fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/lists/${activeListId}/todos/${todo_id}`,
        {
          method: "DELETE",
        }
      ).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete todo");
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      console.error("Error deleting todo:", error.message);
    },
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
                className="flex justify-between mb-4"
              >
                <div className="flex items-center gap-2">
                  {todo.done ? (
                    <CheckCircleIcon className="h-6 w-6 text-teal-500" />
                  ) : (
                    <span onClick={() => markTodoAsDone.mutate(todo.todo_id)}>
                      <CheckCircleIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
                    </span>
                  )}
                  {todo.title}
                </div>
                <div>
                  <EditTodo todo={todo} activeListId={activeListId} />
                  <Button
                    onClick={() => deleteTodo.mutate(todo.todo_id)}
                    className="bg-red-500"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))
          : null}
      </ul>

      <AddTodo activeListId={activeListId} />
    </div>
  );
};

export default Todo;
