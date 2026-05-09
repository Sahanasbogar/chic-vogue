import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/products";

export function ProductCard({ p }: { p: Product }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const wished = wishlist.includes(p.id);
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className="group relative"
    >
      <Link to="/product/$id" params={{ id: p.id }} className="block">
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted luxe-shadow"
        >
          <img src={p.image} alt={p.title}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${hover ? "opacity-0 scale-110" : "opacity-100 scale-100"}`}
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${p.id}/600/800`; }}
          />
          <img src={p.hoverImage} alt="" aria-hidden
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${hover ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = p.image; }}
          />
          {p.badge && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-full glass text-primary">
              {p.badge}
            </span>
          )}
          {p.discount > 0 && (
            <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground">
              -{p.discount}%
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(p.id); }}
            className="absolute bottom-3 right-3 grid place-items-center h-9 w-9 rounded-full glass hover:scale-110 transition-transform"
            aria-label="Wishlist"
          >
            <Heart size={16} className={wished ? "fill-primary text-primary" : "text-foreground"} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); addToCart({ productId: p.id, qty: 1, size: p.sizes[0], color: p.colors[0] }); }}
            className="absolute bottom-3 left-3 right-14 py-2 px-3 text-xs uppercase tracking-wider rounded-full gold-bg text-primary-foreground font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all flex items-center justify-center gap-1"
          >
            <ShoppingBag size={14} /> Add
          </button>
        </div>
      </Link>
      <div className="mt-3 px-1">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.brand}</p>
        <Link to="/product/$id" params={{ id: p.id }}>
          <h3 className="text-sm font-medium truncate hover:text-primary transition-colors">{p.title}</h3>
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold">₹{p.price.toLocaleString()}</span>
          {p.oldPrice > p.price && <span className="text-xs text-muted-foreground line-through">₹{p.oldPrice.toLocaleString()}</span>}
          {p.discount > 0 && <span className="text-xs text-accent">{p.discount}% off</span>}
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star size={12} className="fill-primary text-primary" /> {p.rating.toFixed(1)} ({p.reviews})
        </div>
      </div>
    </motion.div>
  );
}