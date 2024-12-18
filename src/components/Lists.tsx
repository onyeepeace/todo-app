import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLists, editList, deleteList, addList } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const Lists = ({ setActiveList }: { setActiveList: (id: number) => void }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("Lists component mounted");
  }, []);

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
      <div className="mb-4 flex justify-between">
        <h2>Lists</h2>
        <Button
          className="bg-gray-500"
          onClick={() => {
            const name = prompt("Enter new list name:");
            if (name) {
              addListMutation.mutate({ name: name });
            }
          }}
        >
          Add List
        </Button>
      </div>
      <ul>
        {lists.map((list: { list_id: number; name: string }) => {
          const listUrl = `${window.location.origin}/list/${list.list_id}`;
          return (
            <li
              key={list.list_id}
              className="flex justify-between items-center mb-2"
            >
              <span onClick={() => setActiveList(list.list_id)}>
                {list.name}
              </span>
              <div>
                <Button
                  className="mr-2 bg-blue-500"
                  onClick={() => handleEdit(list.list_id, list.name)}
                >
                  Edit
                </Button>
                <Button
                  className="bg-red-500"
                  onClick={() => deleteListMutation.mutate(list.list_id)}
                >
                  Delete
                </Button>
              </div>
              <div>
                <a href={listUrl} target="_blank" rel="noopener noreferrer">
                  Shareable Link
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Lists;
