import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

type FormData = {
  email: string;
  role: "editor" | "viewer";
};

const ShareDialog = ({ itemId }: { itemId: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [role, setRole] = useState<"viewer" | "editor">("viewer");

  const shareItem = useMutation({
    mutationFn: async (values: FormData) => {
      // First lookup the user
      const userResponse = await apiFetch(
        `/api/users/lookup?email=${values.email}`
      );

      // Then share the item
      return apiFetch(`/api/items/${itemId}/share`, {
        method: "POST",
        body: JSON.stringify({
          user_id: userResponse.user_id,
          role: values.role,
        }),
      });
    },
    onSuccess: () => {
      toast.success("Item shared successfully");
      setIsOpen(false);
      reset();
    },
    onError: (error) => {
      toast.error("Failed to share item: " + error.message);
    },
  });

  const onSubmit = (data: FormData) => {
    shareItem.mutate({ ...data, role });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Item</DialogTitle>
          <DialogDescription>
            Enter the email of the person you want to share this item with.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="Enter email address"
                {...register("email")}
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                onValueChange={(value: "viewer" | "editor") => setRole(value)}
                defaultValue="viewer"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Share</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
