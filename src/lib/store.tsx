import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  password: string; // demo only — localStorage
  gender?: string;
  avatar?: string;
  addresses: Address[];
}
export interface Address {
  id: string; label: string; line1: string; city: string;
  state: string; pincode: string; phone: string; isDefault?: boolean;
}
export interface CartItem { productId: string; qty: number; size?: string; color?: string; }
export interface Order {
  id: string; date: string; items: CartItem[]; total: number;
  status: "Ordered" | "Packed" | "Shipped" | "Out for delivery" | "Delivered";
  address: Address;
}

const K = {
  users: "fh_users", session: "fh_session", cart: "fh_cart_",
  wish: "fh_wish_", orders: "fh_orders_",
};

const read = <T,>(k: string, fb: T): T => {
  if (typeof window === "undefined") return fb;
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : fb; } catch { return fb; }
};
const write = (k: string, v: unknown) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
};

interface Ctx {
  user: User | null;
  ready: boolean;
  signup: (u: Omit<User, "id" | "addresses">) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  cart: CartItem[]; wishlist: string[]; orders: Order[];
  addToCart: (i: CartItem) => void;
  updateCartQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (total: number, address: Address) => Order;
  addAddress: (a: Omit<Address, "id">) => void;
  updateAddress: (a: Address) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const sid = read<string | null>(K.session, null);
    if (sid) {
      const users = read<User[]>(K.users, []);
      const u = users.find((x) => x.id === sid) ?? null;
      setUser(u);
      if (u) {
        setCart(read<CartItem[]>(K.cart + u.id, []));
        setWishlist(read<string[]>(K.wish + u.id, []));
        setOrders(read<Order[]>(K.orders + u.id, []));
      }
    }
    setReady(true);
  }, []);

  useEffect(() => { if (user) write(K.cart + user.id, cart); }, [cart, user]);
  useEffect(() => { if (user) write(K.wish + user.id, wishlist); }, [wishlist, user]);
  useEffect(() => { if (user) write(K.orders + user.id, orders); }, [orders, user]);

  const signup: Ctx["signup"] = (u) => {
    const users = read<User[]>(K.users, []);
    if (users.some((x) => x.email.toLowerCase() === u.email.toLowerCase()))
      return { ok: false, error: "Account already exists. Please login." };
    if (users.some((x) => x.mobile === u.mobile))
      return { ok: false, error: "Account already exists. Please login." };
    const nu: User = { ...u, id: "u_" + Date.now(), addresses: [] };
    users.push(nu);
    write(K.users, users);
    write(K.session, nu.id);
    setUser(nu); setCart([]); setWishlist([]); setOrders([]);
    return { ok: true };
  };

  const login: Ctx["login"] = (email, password) => {
    const users = read<User[]>(K.users, []);
    const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u) return { ok: false, error: "No account with this email." };
    if (u.password !== password) return { ok: false, error: "Incorrect password." };
    write(K.session, u.id);
    setUser(u);
    setCart(read(K.cart + u.id, []));
    setWishlist(read(K.wish + u.id, []));
    setOrders(read(K.orders + u.id, []));
    return { ok: true };
  };

  const logout = () => {
    if (typeof window !== "undefined") localStorage.removeItem(K.session);
    setUser(null); setCart([]); setWishlist([]); setOrders([]);
  };

  const updateUser: Ctx["updateUser"] = (patch) => {
    if (!user) return;
    const users = read<User[]>(K.users, []);
    const idx = users.findIndex((x) => x.id === user.id);
    if (idx < 0) return;
    const nu = { ...users[idx], ...patch };
    users[idx] = nu; write(K.users, users); setUser(nu);
  };

  const addToCart: Ctx["addToCart"] = (i) => {
    setCart((c) => {
      const ex = c.find((x) => x.productId === i.productId && x.size === i.size && x.color === i.color);
      if (ex) return c.map((x) => x === ex ? { ...x, qty: x.qty + i.qty } : x);
      return [...c, i];
    });
    toast.success("Added to bag");
  };
  const updateCartQty: Ctx["updateCartQty"] = (pid, qty) =>
    setCart((c) => c.map((x) => x.productId === pid ? { ...x, qty: Math.max(1, qty) } : x));
  const removeFromCart: Ctx["removeFromCart"] = (pid) =>
    setCart((c) => c.filter((x) => x.productId !== pid));
  const clearCart = () => setCart([]);

  const toggleWishlist: Ctx["toggleWishlist"] = (pid) => {
    setWishlist((w) => {
      if (w.includes(pid)) { toast("Removed from wishlist"); return w.filter((x) => x !== pid); }
      toast.success("Added to wishlist"); return [...w, pid];
    });
  };

  const placeOrder: Ctx["placeOrder"] = (total, address) => {
    const order: Order = {
      id: "ORD" + Date.now().toString().slice(-8),
      date: new Date().toISOString(),
      items: cart, total, status: "Ordered", address,
    };
    setOrders((o) => [order, ...o]);
    setCart([]);
    return order;
  };

  const addAddress: Ctx["addAddress"] = (a) => {
    if (!user) return;
    const na: Address = { ...a, id: "a_" + Date.now() };
    const addresses = [...user.addresses, na];
    if (addresses.length === 1) na.isDefault = true;
    updateUser({ addresses });
  };
  const updateAddress: Ctx["updateAddress"] = (a) => {
    if (!user) return;
    updateUser({ addresses: user.addresses.map((x) => x.id === a.id ? a : x) });
  };
  const deleteAddress: Ctx["deleteAddress"] = (id) => {
    if (!user) return;
    updateUser({ addresses: user.addresses.filter((x) => x.id !== id) });
  };
  const setDefaultAddress: Ctx["setDefaultAddress"] = (id) => {
    if (!user) return;
    updateUser({ addresses: user.addresses.map((x) => ({ ...x, isDefault: x.id === id })) });
  };

  return (
    <StoreCtx.Provider value={{
      user, ready, signup, login, logout, updateUser,
      cart, wishlist, orders,
      addToCart, updateCartQty, removeFromCart, clearCart,
      toggleWishlist, placeOrder,
      addAddress, updateAddress, deleteAddress, setDefaultAddress,
    }}>{children}</StoreCtx.Provider>
  );
}

export const useStore = () => {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
};