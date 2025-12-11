import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-3xl font-semibold mb-3">404 - Page not found</h1>
      <p className="text-sm text-slate-600 mb-6">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="inline-block px-4 py-2 rounded bg-slate-800 text-white text-sm"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
