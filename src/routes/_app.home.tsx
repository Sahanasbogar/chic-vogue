import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Truck, ShieldCheck, Gem } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS, trending, newArrivals } from "@/lib/products";

export const Route = createFileRoute("/_app/home")({ component: Home });

const HERO = "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1800&q=80";

function Home() {
  const trend = trending();
  const fresh = newArrivals();
  const featured = PRODUCTS.slice(0, 8);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[80vh] min-h-[560px] overflow-hidden">
        <motion.img src={HERO} alt="" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 8 }}
          className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/30" />
        <div className="relative z-10 mx-auto max-w-7xl h-full px-6 lg:px-12 flex items-end pb-16">
          <div className="max-w-2xl">
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-xs uppercase tracking-[0.4em] text-primary flex items-center gap-2"><Sparkles size={14} /> Fall · Winter · 26</motion.p>
            <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl mt-3 leading-none">
              Wear the<br />
              <span className="gold-text italic">Extraordinary</span>
            </motion.h1>
            <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
              className="mt-5 text-base md:text-lg text-muted-foreground max-w-lg">A new chapter of timeless tailoring, sumptuous textures, and unmistakably modern silhouettes.</motion.p>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.65 }}
              className="mt-6 flex gap-3">
              <Link to="/category/$slug" params={{ slug: "women" }} className="px-6 py-3 rounded-full gold-bg text-primary-foreground font-semibold flex items-center gap-2 hover:opacity-90">
                Shop Women <ArrowRight size={16} />
              </Link>
              <Link to="/category/$slug" params={{ slug: "men" }} className="px-6 py-3 rounded-full glass text-foreground font-semibold flex items-center gap-2 hover:bg-muted">
                Shop Men
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* USP STRIP */}
      <section className="border-y border-border/40 py-6">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { i: Truck, t: "Free Shipping", s: "Orders over ₹2,000" },
            { i: ShieldCheck, t: "Authenticity Guaranteed", s: "100% genuine" },
            { i: Gem, t: "Curated Luxury", s: "Hand-picked styles" },
            { i: Sparkles, t: "Easy Returns", s: "7-day window" },
          ].map((x) => (
            <div key={x.t} className="flex items-center gap-3 justify-center">
              <x.i size={20} className="text-primary" />
              <div className="text-left">
                <p className="text-xs font-semibold">{x.t}</p>
                <p className="text-[10px] text-muted-foreground">{x.s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Categories</p>
            <h2 className="font-display text-4xl mt-2">Shop by World</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.slice(0, 5).map((c, i) => {
            const p = PRODUCTS.find((x) => x.category === c.slug)!;
            return (
              <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl luxe-shadow">
                <img src={p.image} alt={c.label} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-display text-2xl">{c.label}</p>
                  <p className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">Explore →</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* TRENDING */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Trending Now</p>
            <h2 className="font-display text-4xl mt-2">In the spotlight</h2>
          </div>
          <Link to="/offers" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trend.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* BANNER */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 py-12">
        <div className="relative rounded-3xl overflow-hidden h-80 luxe-shadow">
          <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1800&q=80" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-center p-10 max-w-lg">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Members Only</p>
            <h3 className="font-display text-4xl mt-2">Up to 40% off the season's icons</h3>
            <Link to="/offers" className="mt-4 inline-flex w-fit px-5 py-2.5 rounded-full gold-bg text-primary-foreground text-sm font-semibold">Shop the Edit</Link>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">New In</p>
            <h2 className="font-display text-4xl mt-2">Just landed</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(fresh.length ? fresh : featured).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </div>
  );
}