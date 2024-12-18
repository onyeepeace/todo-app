import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Lists from "./components/Lists";
import Todo from "./components/Todo";
import ListDetail from "./components/ListDetail";
import { fetchLists } from "./lib/constants";

const queryClient = new QueryClient();

const App = () => {
  const [activeListId, setActiveListId] = useState<number | null>(null);

  useEffect(() => {
    const initializeActiveList = async () => {
      try {
        const lists = await fetchLists();
        if (lists.length > 0) {
          setActiveListId(lists[0].list_id);
        }
      } catch (error) {
        console.error("Failed to fetch lists:", error);
      }
    };

    initializeActiveList();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="h-screen my-10">
          <div className="h-auto my-10 border-2 rounded-3xl border-gray-800 border-solid w-11/12 mx-auto overflow-hidden pt-8">
            <h1 className="text-center font-bold text-2xl">
              Todo Management App
            </h1>
            <div className="flex my-10 h-auto w-11/12 mx-auto gap-10">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <div className="border-2 border-gray-800 rounded-3xl w-1/3 p-4">
                        <Lists
                          setActiveList={setActiveListId}
                          activeListId={activeListId}
                        />
                      </div>
                      <div className="border-2 border-gray-800 rounded-3xl w-2/3 bg-blue-100 p-4">
                        {activeListId && <Todo activeListId={activeListId} />}
                      </div>
                    </>
                  }
                />
                <Route path="/list/:listId" element={<ListDetail />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
