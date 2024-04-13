import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Cards from "./pages/Cards";
import Users from "./pages/Users";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <>
      <Routes>
        {/* Home/welcome route */}
        <Route path="/" element={<Home />} />

        {/* Authentication routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Layout component wraps child routes that share the same layout (sidebar) */}
        <Route path="/" element={<Layout />}>
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* Protected routes require the user to be authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />

            {/* Admin routes within ProtectedRoute require the user to be an admin */}
            <Route element={<AdminRoute />}>
              <Route path="cards-management" element={<Cards />} />
              <Route path="users-management" element={<Users />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback route for unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* ToastContainer for displaying notifications across the app */}
      <ToastContainer />
    </>
  );
}

export default App;
