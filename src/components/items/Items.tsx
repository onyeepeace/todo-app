import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchItems,
  addItem,
  Item,
  ContentBlock,
  editItem,
  deleteItem,
} from "@/lib/constants";
import { Link } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import { Button } from "@/components/ui/button";

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

  const addItemMutation = useMutation({
    mutationFn: ({
      name,
      content,
    }: {
      name: string;
      content: ContentBlock[];
    }) => addItem(name, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const handleAddItem = () => {
    const name = prompt("Enter item name:");
    if (name) {
      addItemMutation.mutate({ name, content: [] });
    }
  };

  const handleEditItem = (itemId: number) => {
    const newName = prompt("Enter new item name:");
    if (newName) {
      const itemToEdit = items?.find((item) => item.item_id === itemId);
      if (itemToEdit) {
        const updatedContent = itemToEdit.content;
        editItem(itemId, newName, updatedContent)
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ["items"] });
          })
          .catch((error) => {
            console.error("Error editing item:", error.message);
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

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-3xl my-10 border-2 rounded-3xl border-gray-800 border-solid mx-auto overflow-hidden pt-8">
        <h1 className="text-center font-bold text-2xl mb-4">Jot It</h1>
        <div className="flex justify-end p-4">
          <LogoutButton />
        </div>
        <div className="flex justify-between items-center mb-4 px-4">
          <button
            onClick={handleAddItem}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Add New Item
          </button>
        </div>
        <ul className="space-y-4 px-4">
          {items?.map((item: Item) => (
            <li
              key={item.item_id}
              className="flex justify-between items-center p-4 border-b border-gray-300"
            >
              <Link
                to={`/item/${item.item_id}`}
                className="text-lg font-medium"
              >
                {item.name}
              </Link>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEditItem(item.item_id)}
                  className="bg-blue-400 text-white"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteItem(item.item_id)}
                  className="bg-red-500 text-white"
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Items;
