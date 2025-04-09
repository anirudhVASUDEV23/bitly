import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="nav-header">
        <div className="nav-container">
          <div className="flex items-center">
            <a href="/dashboard" className="nav-brand">
              URL Shortener
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={handleLogout} className="nav-button">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
