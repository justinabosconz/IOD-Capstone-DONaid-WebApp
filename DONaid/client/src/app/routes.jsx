import React from "react";
import AppShell from "../components/layout/AppShell";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ItemListPage from "../pages/ItemListPage";
import ItemDetailPage from "../pages/ItemDetailPage";
import CreateItemPage from "../pages/CreateItemPage";
import EditItemPage from "../pages/EditItemPage";
import ChatsPage from "../pages/ChatsPage";
import ChatRoomPage from "../pages/ChatRoomPage";
import NotFoundPage from "../pages/NotFoundPage";

const routes = [
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <ItemListPage /> },
      { path: "items/:id", element: <ItemDetailPage /> },

      {
        path: "create",
        element: (
          <ProtectedRoute>
            <CreateItemPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "items/:id/edit",
        element: (
          <ProtectedRoute>
            <EditItemPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "chats",
        element: (
          <ProtectedRoute>
            <ChatsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "chats/:id",
        element: (
          <ProtectedRoute>
            <ChatRoomPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "*", element: <NotFoundPage /> },
];

export default routes;
