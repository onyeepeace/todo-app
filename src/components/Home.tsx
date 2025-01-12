import { useState } from "react";
import Lists from "./Lists";
import Todo from "./Todo";
import LogoutButton from "./LogoutButton";

const Home = () => {
  const [activeListId, setActiveListId] = useState<number | null>(null);

  return (
    <div className="h-screen my-10">
      <div className="h-auto my-10 border-2 rounded-3xl border-gray-800 border-solid w-11/12 mx-auto overflow-hidden pt-8">
        <h1 className="text-center font-bold text-2xl">Todo Management App</h1>
        <div className="flex justify-end p-4">
          <LogoutButton />
        </div>
        <div className="flex my-10 h-auto w-11/12 mx-auto gap-10">
          <div className="border-2 border-gray-800 rounded-3xl w-1/3 p-4">
            <Lists
              activeListId={activeListId}
              setActiveListId={setActiveListId}
            />
          </div>
          <div className="border-2 border-gray-800 rounded-3xl w-2/3 bg-blue-100 p-4">
            {activeListId && <Todo activeListId={activeListId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
