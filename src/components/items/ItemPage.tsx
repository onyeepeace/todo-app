import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchItemById, editItem, Item, ContentBlock } from "@/lib/constants";
import ItemContent from "./ItemContent";
import { useState, useEffect } from "react";
import Todos from "../todos/Todos";

const ItemPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const queryClient = useQueryClient();

  const {
    data: item,
    isLoading,
    isError,
  } = useQuery<Item>({
    queryKey: ["item", itemId],
    queryFn: () => fetchItemById(Number(itemId)),
    enabled: !!itemId,
  });

  const [content, setContent] = useState<ContentBlock[]>([]);
  const [showSavedPrompt, setShowSavedPrompt] = useState(false);

  const editItemMutation = useMutation({
    mutationFn: (content: ContentBlock[]) =>
      item ? editItem(Number(itemId), item.name, content) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item", itemId] });
      setShowSavedPrompt(true);
      setTimeout(() => setShowSavedPrompt(false), 3000);
    },
  });

  useEffect(() => {
    if (item && Array.isArray(item.content)) {
      setContent(item.content);
    }
  }, [item]);

  const handleSave = () => {
    if (itemId && item) {
      editItemMutation.mutate(content);
    }
  };

  if (isLoading) return <p>Loading item...</p>;
  if (isError) return <p>Error loading item. Please try again later.</p>;

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h2 className="text-xl font-bold">{item?.name}</h2>
      <ItemContent content={content} onChange={setContent} />
      <Todos itemId={Number(itemId)} />
      <button
        onClick={handleSave}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Save
      </button>
      {showSavedPrompt && (
        <div className="mt-2 text-green-600 font-semibold">Saved!</div>
      )}
    </div>
  );
};

export default ItemPage;
