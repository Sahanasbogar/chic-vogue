import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Heart, ShoppingBag, Search, User as UserIcon, Menu, X, LogOut, Package } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { user, logout, cart, wishlist } = useStore();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [q, setQ] = useState("");
  const [showSug, setShowSug] = useState(false);
  const nav = useNavigate();
  const router = useRouter();

  const cartCount = cart.reduce((a, b) => a + b.qty, 0);
  const suggestions = q.length > 1
    ? PRODUCTS.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) { nav({ to: "/search", search: { q } as never }); setShowSug(false); }
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <button className="lg:hidden text-foreground" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Link to="/home" className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-wider gold-text">FashionHub</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {CATEGORIES.slice(0, 7).map((c) => (
              <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }}
                className="relative text-sm uppercase tracking-wider text-foreground/80 hover:text-primary transition-colors group">
                {c.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Link to="/offers" className="text-sm uppercase tracking-wider text-accent hover:text-primary transition-colors">Offers</Link>
          </nav>

          <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setShowSug(true); }}
              onBlur={() => setTimeout(() => setShowSug(false), 150)}
              placeholder="Search luxury, brands..."
              className="w-full rounded-full bg-muted/60 pl-9 pr-4 py-2 text-sm border border-border/60 focus:outline-none focus:border-primary"
            />
            {showSug && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full glass rounded-xl overflow-hidden luxe-shadow">
                {suggestions.map((s) => (
                  <button key={s.id} type="button" onMouseDown={() => { nav({ to: "/product/$id", params: { id: s.id } }); setShowSug(false); setQ(""); }}
                    className="flex w-full items-center gap-3 p-2 hover:bg-muted text-left">
                    <img src={s.image} alt="" className="h-10 w-10 rounded object-cover" />
                    <div className="flex-1">
                      <div className="text-xs">{s.title}</div>
                      <div className="text-[10px] text-muted-foreground">{s.brand}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="flex items-center gap-3">
            <Link to="/wishlist" className="relative p-2 hover:text-primary transition-colors">
              <Heart size={20} />
              {wishlist.length > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground grid place-items-center">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className="relative p-2 hover:text-primary transition-colors">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground grid place-items-center">{cartCount}</span>}
            </Link>
            <div className="relative">
              <button onClick={() => setProfileOpen((v) => !v)} className="p-2 hover:text-primary transition-colors flex items-center gap-2">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="h-7 w-7 rounded-full object-cover ring-1 ring-primary" />
                ) : <UserIcon size={20} />}
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-56 glass rounded-xl p-2 luxe-shadow">
                    <div className="px-3 py-2 border-b border-border/40">
                      <p className="text-xs text-muted-foreground">Signed in as</p>
                      <p className="text-sm font-medium truncate">{user?.fullName}</p>
                    </div>
                    {[
                      { to: "/profile", label: "My Profile", icon: UserIcon },
                      { to: "/orders", label: "My Orders", icon: Package },
                      { to: "/wishlist", label: "Wishlist", icon: Heart },
                    ].map((it) => (
                      <Link key={it.to} to={it.to} onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted">
                        <it.icon size={14} /> {it.label}
                      </Link>
                    ))}
                    <button onClick={() => { logout(); setProfileOpen(false); router.navigate({ to: "/login" }); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted text-destructive">
                      <LogOut size={14} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="lg:hidden overflow-hidden">
              <div className="py-3 grid gap-2">
                {CATEGORIES.map((c) => (
                  <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded-lg hover:bg-muted text-sm uppercase tracking-wider">{c.label}</Link>
                ))}
                <Link to="/offers" onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-muted text-sm uppercase text-accent">Offers</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}