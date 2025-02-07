import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GoogleLoginButton from "./components/auth/GoogleLoginButton";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ItemPage from "./components/items/ItemPage";
import Items from "./components/items/Items";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Router>
          <Routes>
            <Route path="/login" element={<GoogleLoginButton />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Items />
                </ProtectedRoute>
              }
            />
            <Route
              path="/item/:itemId"
              element={
                <ProtectedRoute>
                  <ItemPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
