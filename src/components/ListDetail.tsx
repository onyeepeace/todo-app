import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchListById } from "@/lib/constants";
import SharedTodo from "./SharedTodo";

const ListDetail = () => {
  const { listId } = useParams<{ listId: string }>();

  const {
    data: list,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["list", listId],
    queryFn: () => fetchListById(Number(listId)),
    enabled: !!listId,
  });

  if (isLoading) return <p>Loading list details...</p>;
  if (isError) return <p>Error loading list details.</p>;
  if (!list) return <p>No list found.</p>;

  return (
    <div className="flex h-auto w-11/12 mx-auto gap-10">
      <div className="border-2 border-gray-800 rounded-3xl w-1/3 p-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="font-bold text-2xl">Lists</h1>
        </div>
        <div className="flex justify-between items-center mb-2 border-2 border-gray-800 rounded-2xl p-4 text-xl">
          <h1 className="text-xl">{list.name}</h1>
        </div>
      </div>
      <div className="w-2/3 bg-blue-100 p-4 border-2 border-gray-800 rounded-3xl">
        <SharedTodo activeListId={Number(listId)} />
      </div>
    </div>
  );
};

export default ListDetail;
