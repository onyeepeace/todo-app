import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Todo from "./components/Todo";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Todo />
    </QueryClientProvider>
  );
};

export default App;
