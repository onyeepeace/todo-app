import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "@/lib/constants";
import { apiFetch } from "@/lib/api";

type FormData = {
  title: string;
  body: string;
};

const EditTodo = ({ todo, itemId }: { todo: Todo; itemId: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: todo.title,
      body: todo.body,
    },
  });

  const updateTodo = useMutation({
    mutationFn: async (values: { title: string; body: string }) => {
      return apiFetch(`/api/items/${itemId}/todos/${todo.todo_id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", itemId] });
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Error editing todo:", error.message);
    },
  });

  const onSubmit = (data: FormData) => {
    updateTodo.mutate(data);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mr-2 bg-blue-500">Edit</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Edit Todo</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <Label htmlFor="title">Title</Label>
              <Input
                required
                placeholder="Edit the title"
                {...register("title")}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="body">Body</Label>
              <Textarea
                required
                placeholder="Edit the description"
                {...register("body")}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild className="bg-gray-300 mr-2">
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-green-700">
                Update todo
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditTodo;
