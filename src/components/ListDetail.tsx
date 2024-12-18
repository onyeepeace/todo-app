import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchListById } from "@/lib/constants";

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
    <div>
      <h1>{list.name}</h1>
    </div>
  );
};

export default ListDetail;
