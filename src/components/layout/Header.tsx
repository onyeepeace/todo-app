import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../auth/LogoutButton";

const Header = () => {
  const { username } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold">Jot It</h1>
          <div className="flex items-center gap-3">
            {username && (
              <>
                <span className="text-sm font-medium">{username}</span>
                <LogoutButton />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
