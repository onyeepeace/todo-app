import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      console.log("Auth code received:", codeResponse.code);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/auth/callback?code=${
            codeResponse.code
          }`
        );

        if (!response.ok) {
          throw new Error("Failed to exchange token");
        }

        const { token } = await response.json();
        localStorage.setItem("authToken", token);

        login();
        navigate("/");
      } catch (error) {
        console.error("Error during Google login:", error);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
    },
  });

  return <Button onClick={() => googleLogin()}>Login with Google</Button>;
};

export default GoogleLoginButton;
