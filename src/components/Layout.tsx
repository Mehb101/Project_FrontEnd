import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-800 text-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="font-semibold text-lg">
            Pro-Tasker
          </Link>
          <nav className="flex items-center gap-4">
            {user && (
              <span className="text-sm">
                Logged in as <span className="font-medium">{user.username}</span>
              </span>
            )}
            {user ? (
              <button
                onClick={logout}
                className="text-sm px-3 py-1 rounded bg-slate-600 hover:bg-slate-500"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm px-3 py-1 rounded bg-slate-600 hover:bg-slate-500"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm px-3 py-1 rounded border border-slate-400 hover:bg-slate-700"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
