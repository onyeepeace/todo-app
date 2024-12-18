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

type FormData = {
  title: string;
  body: string;
};

const AddTodo = ({ activeListId }: { activeListId: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<FormData>();

  const createTodo = useMutation({
    mutationFn: async (values: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/lists/${activeListId}/todos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      const responseBody = await response.text();
      return responseBody ? JSON.parse(responseBody) : {};
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
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
            <div className="mb-4">
              <Label htmlFor="body">Body</Label>
              <Textarea
                required
                placeholder="Tell me more..."
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
