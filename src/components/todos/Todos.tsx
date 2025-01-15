import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodos, Todo } from "@/lib/constants";
import { SquareCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";
import EditTodo from "./EditTodo";
import AddTodo from "./AddTodo";

const Todos = ({ itemId }: { itemId: number }) => {
  const queryClient = useQueryClient();

  const {
    data: todos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos", itemId],
    queryFn: () => fetchTodos(itemId),
    enabled: !!itemId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const markTodoAsDone = useMutation<
    void,
    Error,
    number,
    { previousTodos: Todo[] | undefined }
  >({
    mutationFn: (todo_id: number) =>
      apiFetch(`/api/items/${itemId}/todos/${todo_id}/done`, {
        method: "PATCH",
      }),
    onMutate: async (todo_id) => {
      await queryClient.cancelQueries({ queryKey: ["todos", itemId] });

      const previousTodos = queryClient.getQueryData<Todo[]>(["todos", itemId]);

      queryClient.setQueryData<Todo[]>(["todos", itemId], (oldTodos) =>
        oldTodos?.map((todo) =>
          todo.todo_id === todo_id ? { ...todo, done: true } : todo
        )
      );

      return { previousTodos };
    },
    onError: (_err, _todo_id, context) => {
      queryClient.setQueryData(["todos", itemId], context?.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", itemId] });
    },
  });

  const deleteTodo = useMutation<void, Error, number>({
    mutationFn: (todo_id: number) =>
      apiFetch(`/api/items/${itemId}/todos/${todo_id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", itemId] });
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
                className="flex justify-between mb-4 gap-4"
              >
                <div className="flex items-center gap-6 text-xl">
                  {todo.done ? (
                    <SquareCheck className="text-teal-500 size-9" />
                  ) : (
                    <span onClick={() => markTodoAsDone.mutate(todo.todo_id)}>
                      <SquareCheck className="text-gray-500 cursor-pointer size-9" />
                    </span>
                  )}
                  {todo.title}
                </div>
                <div className="flex gap-4">
                  <EditTodo todo={todo} itemId={itemId} />
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

      <AddTodo itemId={itemId} />
    </div>
  );
};

export default Todos;
