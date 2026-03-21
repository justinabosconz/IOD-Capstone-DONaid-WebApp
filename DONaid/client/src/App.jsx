import React, { useState } from "react";
import { Box } from "@mui/material";

import { useAuth } from "./context/AuthContext";
import { useItems } from "./context/ItemsContext";

import LoginPage from "./pages/LoginPage";
import ItemsPage from "./pages/ItemsPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import AddItemPage from "./pages/AddItemPage";
import NavBar from "./components/NavBar";

export default function App() {
  const { user, loading } = useAuth();
  const { refresh } = useItems();

  const [view, setView] = useState("items"); // items | detail | add
  const [selectedId, setSelectedId] = useState(null);

  if (loading) return <Box sx={{ p: 3 }}>Loading...</Box>;
  if (!user) return <LoginPage />;

  function goItems() {
    setView("items");
    setSelectedId(null);
    refresh();
  }

  return (
    <Box>
      <NavBar onAdd={() => setView("add")} />
      {view === "items" && (
        <ItemsPage
          onView={(id) => {
            setSelectedId(id);
            setView("detail");
          }}
        />
      )}
      {view === "detail" && (
        <ItemDetailPage itemId={selectedId} onBack={goItems} />
      )}
      {view === "add" && <AddItemPage onDone={goItems} />}
    </Box>
  );
}
