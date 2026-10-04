import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const CART_STORAGE_KEY = 'scentstack_cart_v1';

// The cart lives in sessionStorage so it only survives within the current tab/visit.
// A fresh visit (e.g. arriving from a Pinterest pin) always starts with an empty cart
// instead of showing a stale "Checkout" bar from a previous session.
// The old localStorage cart is removed once so leftover items disappear.
try {
  localStorage.removeItem(CART_STORAGE_KEY);
} catch {
  // Storage unavailable — nothing to clean up.
}

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
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
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
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
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
