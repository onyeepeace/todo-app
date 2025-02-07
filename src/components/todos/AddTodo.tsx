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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

type FormData = {
  title: string;
};

const AddTodo = ({ itemId }: { itemId: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<FormData>();

  const createTodo = useMutation({
    mutationFn: async (values: FormData) => {
      return apiFetch(`/api/items/${itemId}/todos`, {
        method: "POST",
        body: JSON.stringify(values),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", itemId] });
      reset();
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Error creating todo:", error.message);
    },
  });

  const onSubmit = (data: FormData) => {
    createTodo.mutate(data);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full my-4 bg-gray-900">Add Todo</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add Todo</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <Label htmlFor="title">Title</Label>
              <Input
                required
                placeholder="What do you want to do?"
                {...register("title")}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild className="bg-gray-300 mr-2">
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-green-700">
                Create todo
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTodo;
