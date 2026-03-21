import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../api/api";
import { useAuth } from "./AuthContext";

const ItemsContext = createContext(null);

export function ItemsProvider({ children }) {
  const { token, loading } = useAuth();
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  async function refresh() {
    setLoadingItems(true);
    try {
      const data = await api.listItems();
      setItems(data);
    } finally {
      setLoadingItems(false);
    }
  }

  async function addItem(payload) {
    if (!token) throw new Error("Missing auth token. Please log in again.");
    const created = await api.createItem(token, payload);
    setItems((prev) => [created, ...prev]);
    return created;
  }

  async function updateItem(id, payload) {
    if (!token) throw new Error("Missing auth token. Please log in again.");
    const updated = await api.updateItem(token, id, payload);

    // Update local state
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updated } : i)),
    );
    return updated;
  }

  async function deleteItem(id) {
    if (!token) throw new Error("Missing auth token. Please log in again.");
    await api.deleteItem(token, id);

    // Remove locally
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  useEffect(() => {
    if (loading) return;
    refresh();
  }, [loading]);

  const value = useMemo(
    () => ({ items, loadingItems, refresh, addItem, updateItem, deleteItem }),
    [items, loadingItems],
  );

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
}

export function useItems() {
  return useContext(ItemsContext);
}
