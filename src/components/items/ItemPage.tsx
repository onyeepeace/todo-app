import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchItemById, editItem, Item, ApiError } from "@/lib/constants";
import ItemContent from "./ItemContent";
import { useState, useEffect } from "react";
import Todos from "../todos/Todos";
import { JSONContent } from "@tiptap/react";
import { toast } from "sonner";
import ShareDialog from "./ShareDialog";

const ItemPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const queryClient = useQueryClient();

  const {
    data: item,
    isLoading,
    isError,
  } = useQuery<Item>({
    queryKey: ["item", itemId],
    queryFn: async () => {
      const response = await fetchItemById(Number(itemId));
      return response;
    },
    enabled: !!itemId,
  });

  const [content, setContent] = useState<JSONContent>({
    type: "doc",
    content: [{ type: "paragraph" }],
  });
  const [showSavedPrompt, setShowSavedPrompt] = useState(false);

  useEffect(() => {
    if (item?.content) {
      setContent(item.content);
    }
  }, [item]);

  const editItemMutation = useMutation({
    mutationFn: (params: { content: JSONContent; version: number }) =>
      item
        ? editItem(Number(itemId), item.name, params.content, params.version)
        : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item", itemId] });
      toast.success("Changes saved successfully");
      setShowSavedPrompt(true);
      setTimeout(() => setShowSavedPrompt(false), 3000);
    },
    onError: (error: ApiError) => {
      if (
        error.message.includes("409") ||
        error.message.includes("modified by another user")
      ) {
        toast.error(
          "This document has been modified by someone else. Refreshing with latest version...",
          {
            duration: 4000,
          }
        );
        queryClient.invalidateQueries({ queryKey: ["item", itemId] });
      } else {
        toast.error("Failed to save changes. Please try again.");
      }
    },
  });

  const handleSave = () => {
    if (itemId && item) {
      editItemMutation.mutate({
        content,
        version: item.version,
      });
    }
  };

  const userRole = item?.role || "viewer";
  const canEdit = userRole === "owner" || userRole === "editor";

  if (isLoading) return <p>Loading item...</p>;
  if (isError) return <p>Error loading item. Please try again later.</p>;

  return (
    <div className="p-8 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{item?.name}</h2>
        {userRole === "owner" && <ShareDialog itemId={Number(itemId)} />}
      </div>
      <ItemContent
        content={content}
        onChange={setContent}
        readOnly={!canEdit}
      />
      <Todos itemId={Number(itemId)} role={userRole} />
      {canEdit && (
        <button
          onClick={handleSave}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>
      )}
      {showSavedPrompt && (
        <div className="mt-2 text-green-600 font-semibold">Saved!</div>
      )}
    </div>
  );
};

export default ItemPage;
