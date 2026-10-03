import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const CART_STORAGE_KEY = 'scentstack_cart_v1';

type CartContextValue = {
  items: string[]; // product ids, each at most once
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  clearCart: () => void;
  hasItem: (id: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): string[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>(() => readStoredCart());

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private browsing, etc.) — cart just won't persist across reloads.
    }
  }, [items]);

  const addItem = (id: string) => setItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const removeItem = (id: string) => setItems((prev) => prev.filter((itemId) => itemId !== id));
  const toggleItem = (id: string) =>
    setItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  const clearCart = () => setItems([]);
  const hasItem = (id: string) => items.includes(id);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, toggleItem, clearCart, hasItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
