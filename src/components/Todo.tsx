import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodos } from "@/lib/constants";
import AddTodo from "./AddTodo";
import EditTodo from "./EditTodo";

export interface Todo {
  id: number;
  title: string;
  body: string;
  done: boolean;
}

const Todo = () => {
  const queryClient = useQueryClient();

  const {
    data: todos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const markTodoAsDone = useMutation<void, Error, number>({
    mutationFn: (id: number) =>
      fetch(`${import.meta.env.VITE_BASE_URL}/api/todos/${id}/done`, {
        method: "PATCH",
      }).then((res) => {
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
    mutationFn: (id: number) =>
      fetch(`${import.meta.env.VITE_BASE_URL}/api/todos/${id}`, {
        method: "DELETE",
      }).then((res) => {
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
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading todos. Please try again later.</p>;
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <ul className="list-none">
        {todos.map((todo: Todo) => (
          <li
            key={`todo_list__${todo.id}`}
            className="flex justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              {todo.done ? (
                <CheckCircleIcon className="h-6 w-6 text-teal-500" />
              ) : (
                <span onClick={() => markTodoAsDone.mutate(todo.id)}>
                  <CheckCircleIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
                </span>
              )}
              {todo.title}
            </div>
            <div>
              <EditTodo todo={todo} />
              <Button
                onClick={() => deleteTodo.mutate(todo.id)}
                className="bg-red-500"
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <AddTodo />
    </div>
  );
};

export default Todo;
