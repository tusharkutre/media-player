import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VideoPlayer from "../components/VideoPlayer";

const router = createBrowserRouter([
  { path: "/", element: <Login/> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/videos", element: <VideoPlayer/> },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;