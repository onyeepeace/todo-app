import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchItems,
  addItem,
  Item,
  editItem,
  deleteItem,
} from "@/lib/constants";
import { Link } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import { Button } from "@/components/ui/button";
import { JSONContent } from "@tiptap/react";

const Items = () => {
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: fetchItems,
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const privateItems = items?.filter((item) => item.role === "owner") || [];
  const sharedItems =
    items?.filter((item) => ["viewer", "editor"].includes(item.role)) || [];

  const addItemMutation = useMutation({
    mutationFn: ({ name }: { name: string }) => {
      const initialContent: JSONContent = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Start typing..." }],
          },
        ],
      };
      return addItem(name, initialContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const handleAddItem = () => {
    const name = prompt("Enter item name:");
    if (name) {
      addItemMutation.mutate({ name });
    }
  };

  const handleEditItem = (itemId: number) => {
    const newName = prompt("Enter new item name:");
    if (newName) {
      const itemToEdit = items?.find((item) => item.item_id === itemId);
      if (itemToEdit) {
        editItem(itemId, newName, itemToEdit.content, itemToEdit.version)
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ["items"] });
          })
          .catch((error) => {
            console.error("Error editing item:", error.message);
            if (error.message.includes("version conflict")) {
              alert(
                "This item has been modified by someone else. Please refresh and try again."
              );
            }
            queryClient.invalidateQueries({ queryKey: ["items"] });
          });
      }
    }
  };

  const handleDeleteItem = (itemId: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      // Optimistically update the UI
      queryClient.setQueryData<Item[]>(["items"], (oldItems) =>
        oldItems?.filter((item) => item.item_id !== itemId)
      );

      deleteItem(itemId)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["items"] });
        })
        .catch((error) => {
          console.error("Error deleting item:", error.message);
          queryClient.invalidateQueries({ queryKey: ["items"] });
        });
    }
  };

  if (isLoading) return <p>Loading items...</p>;

  const ItemList = ({ items, title }: { items: Item[]; title: string }) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-500 italic">No items found</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.item_id}
              className="flex justify-between items-center p-4 border rounded-lg border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Link
                  to={`/item/${item.item_id}`}
                  className="text-lg font-medium hover:text-blue-600"
                >
                  {item.name}
                </Link>
                {item.role !== "owner" && (
                  <span className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {item.role}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {(item.role === "owner" || item.role === "editor") && (
                  <Button
                    onClick={() => handleEditItem(item.item_id)}
                    className="bg-blue-400 text-white"
                  >
                    Edit
                  </Button>
                )}
                {item.role === "owner" && (
                  <Button
                    onClick={() => handleDeleteItem(item.item_id)}
                    className="bg-red-500 text-white"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Jot It</h1>
          <div className="flex gap-4">
            <Button
              onClick={handleAddItem}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Add New Item
            </Button>
            <LogoutButton />
          </div>
        </div>

        <ItemList items={privateItems} title="My Items" />
        <ItemList items={sharedItems} title="Shared with me" />
      </div>
    </div>
  );
};

export default Items;
