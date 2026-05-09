import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Heart, ShoppingBag, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { findProduct, byCategory } from "@/lib/products";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/_app/product/$id")({ component: ProductPage });

function ProductPage() {
  const { id } = useParams({ from: "/_app/product/$id" });
  const p = findProduct(id);
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [size, setSize] = useState<string | undefined>(p?.sizes[0]);
  const [color, setColor] = useState<string | undefined>(p?.colors[0]);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  if (!p) return <div className="min-h-[60vh] grid place-items-center">Product not found.<Link to="/home" className="ml-2 text-primary">Go home</Link></div>;
  const images = [p.image, p.hoverImage, p.image];
  const wished = wishlist.includes(p.id);
  const related = byCategory(p.category).filter((x) => x.id !== p.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12 py-10">
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <motion.div key={activeImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative aspect-[3/4] overflow-hidden rounded-3xl luxe-shadow group">
            <img src={images[activeImg]} alt={p.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            {p.badge && <span className="absolute top-4 left-4 px-3 py-1 text-xs uppercase tracking-wider rounded-full glass text-primary">{p.badge}</span>}
          </motion.div>
          <div className="mt-3 flex gap-2">
            {images.map((src, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`h-20 w-20 rounded-xl overflow-hidden border-2 ${activeImg === i ? "border-primary" : "border-transparent"}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">{p.brand}</p>
          <h1 className="font-display text-4xl mt-2">{p.title}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-primary"><Star size={14} className="fill-primary" /> {p.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">· {p.reviews} reviews</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">₹{p.price.toLocaleString()}</span>
            {p.oldPrice > p.price && <span className="text-base text-muted-foreground line-through">₹{p.oldPrice.toLocaleString()}</span>}
            {p.discount > 0 && <span className="text-sm text-accent">({p.discount}% off)</span>}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-widest mb-2">Size</p>
            <div className="flex gap-2 flex-wrap">
              {p.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`px-4 py-2 rounded-lg text-sm border transition ${size === s ? "border-primary text-primary" : "border-border hover:border-primary/60"}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-widest mb-2">Color</p>
            <div className="flex gap-3">
              {p.colors.map((c) => (
                <button key={c} onClick={() => setColor(c)} className={`h-9 w-9 rounded-full border-2 ${color === c ? "border-primary" : "border-border"}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <p className="text-xs uppercase tracking-widest">Quantity</p>
            <div className="flex items-center border border-border rounded-lg">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1.5">−</button>
              <span className="px-3 text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-1.5">+</button>
            </div>
            <span className="text-xs text-muted-foreground">{p.stock} in stock</span>
          </div>

          <div className="mt-7 flex gap-3">
            <button onClick={() => addToCart({ productId: p.id, qty, size, color })}
              className="flex-1 py-3.5 rounded-xl gold-bg text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90">
              <ShoppingBag size={16} /> Add to Bag
            </button>
            <button onClick={() => toggleWishlist(p.id)} className="px-4 py-3.5 rounded-xl glass border border-border hover:border-primary">
              <Heart size={18} className={wished ? "fill-primary text-primary" : ""} />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {[
              { i: Truck, t: "Free shipping" }, { i: RefreshCw, t: "7-day returns" }, { i: ShieldCheck, t: "Authentic" },
            ].map((x) => (
              <div key={x.t} className="glass rounded-xl p-3">
                <x.i size={18} className="mx-auto text-primary" />
                <p className="mt-1 text-[11px]">{x.t}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-sm uppercase tracking-widest text-primary mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
          </div>

          <div className="mt-8">
            <h3 className="text-sm uppercase tracking-widest text-primary mb-3">Customer Reviews</h3>
            <div className="space-y-3">
              {[
                { n: "Aisha", t: "Absolutely stunning. Quality exceeded expectations." },
                { n: "Rohan", t: "Fits true to size. Will buy again." },
                { n: "Meera", t: "Worth every rupee. Looks even better in person." },
              ].map((r) => (
                <div key={r.n} className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs"><span className="font-semibold">{r.n}</span><Star size={12} className="fill-primary text-primary" /><span className="text-primary">5.0</span></div>
                  <p className="text-sm mt-1 text-muted-foreground">{r.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl mb-6">You may also love</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {related.map((r) => <ProductCard key={r.id} p={r} />)}
        </div>
      </section>
    </div>
  );
}