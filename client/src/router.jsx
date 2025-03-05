import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import ErrorMessage from "./pages/ErrorMessage";
import Login from "./pages/Login";
import ChatRoom from "./pages/ChatRoom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        errorElement: <ErrorMessage />,
        children: [
          { index: true, element: <Navigate to="/login" /> },
          { path: "login", children: [{ index: true, element: <Login /> }] },
          { path: "chatroom", element: <ChatRoom /> },
        ],
      },
    ],
  },
]);
