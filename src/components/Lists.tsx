import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLists, editList, deleteList, addList } from "@/lib/constants";
import { ArrowUpSquare, Pencil, Plus, Trash2 } from "lucide-react";

const Lists = ({
  setActiveList,
  activeListId,
}: {
  setActiveList: (id: number) => void;
  activeListId: number | null;
}) => {
  const queryClient = useQueryClient();

  const {
    data: lists,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lists"],
    queryFn: () => {
      console.log("Fetching lists");
      return fetchLists();
    },
  });

  const addListMutation = useMutation({
    mutationFn: addList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });

  const editListMutation = useMutation({
    mutationFn: editList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });

  const handleEdit = (list_id: number, currentName: string) => {
    const newName = prompt("Enter new list name:", currentName);
    if (newName && newName !== currentName) {
      editListMutation.mutate({ listId: list_id, name: newName });
    }
  };

  if (isLoading) return <p>Loading lists...</p>;
  if (isError) return <p>Error loading lists.</p>;

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="font-bold text-2xl">Lists</h1>
        <div
          className=""
          onClick={() => {
            const name = prompt("Enter new list name:");
            if (name) {
              addListMutation.mutate({ name: name });
            }
          }}
        >
          <Plus className="text-gray-800 cursor-pointer size-9" />
        </div>
      </div>
      <ul className="flex flex-col gap-8">
        {lists.map((list: { list_id: number; name: string }) => {
          const listUrl = `${window.location.origin}/list/${list.list_id}`;
          const isActive = list.list_id === activeListId;
          return (
            <li
              key={list.list_id}
              className={`flex justify-between items-center mb-2 border-2 border-gray-800 rounded-2xl p-4 text-xl ${
                isActive ? "bg-blue-100" : ""
              }`}
            >
              <span
                className="cursor-pointer"
                onClick={() => setActiveList(list.list_id)}
              >
                {list.name}
              </span>
              <div className="flex gap-4">
                <div
                  className=""
                  onClick={() => handleEdit(list.list_id, list.name)}
                >
                  <Pencil className="text-blue-500 cursor-pointer size-7" />
                </div>
                <div
                  className=""
                  onClick={() => deleteListMutation.mutate(list.list_id)}
                >
                  <Trash2 className="text-red-500 cursor-pointer size-7" />
                </div>
                <div>
                  <a href={listUrl} target="_blank" rel="noopener noreferrer">
                    <ArrowUpSquare className="text-gray-500 cursor-pointer size-7" />
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Lists;
