import { createFileRoute, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { byCategory, CATEGORIES, type Category } from "@/lib/products";

export const Route = createFileRoute("/_app/category/$slug")({ component: CategoryPage });

const COVERS: Record<Category, string> = {
  men: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80",
  women: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=80",
  kids: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=1800&q=80",
  watches: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1800&q=80",
  footwear: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1800&q=80",
  beauty: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1800&q=80",
  bags: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1800&q=80",
  jewelry: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1800&q=80",
  accessories: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1800&q=80",
};

function CategoryPage() {
  const { slug } = useParams({ from: "/_app/category/$slug" });
  const cat = (CATEGORIES.find((c) => c.slug === slug)?.slug ?? "men") as Category;
  const all = useMemo(() => byCategory(cat), [cat]);
  const [sort, setSort] = useState<"popular" | "lowhigh" | "highlow" | "rating">("popular");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [brands, setBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  const allBrands = Array.from(new Set(all.map((p) => p.brand)));
  const filtered = useMemo(() => {
    let r = all.filter((p) => p.price <= maxPrice && p.rating >= minRating);
    if (brands.length) r = r.filter((p) => brands.includes(p.brand));
    if (sort === "lowhigh") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "highlow") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [all, maxPrice, minRating, brands, sort]);

  const label = CATEGORIES.find((c) => c.slug === cat)?.label ?? cat;

  return (
    <div>
      <section className="relative h-72 overflow-hidden">
        <img src={COVERS[cat]} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/30" />
        <div className="relative z-10 h-full flex flex-col justify-end p-8 max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Collection</p>
          <h1 className="font-display text-5xl mt-2">{label}</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} pieces curated for you</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-10 grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="space-y-6">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-xs uppercase tracking-widest text-primary mb-3">Sort</h3>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
              className="w-full bg-input rounded-lg px-3 py-2 text-sm border border-border focus:border-primary outline-none">
              <option value="popular">Most popular</option>
              <option value="lowhigh">Price: Low to High</option>
              <option value="highlow">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="text-xs uppercase tracking-widest text-primary mb-3">Price under ₹{maxPrice.toLocaleString()}</h3>
            <input type="range" min={500} max={50000} step={500} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-primary" />
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="text-xs uppercase tracking-widest text-primary mb-3">Brand</h3>
            <div className="space-y-2 max-h-48 overflow-auto">
              {allBrands.map((b) => (
                <label key={b} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={brands.includes(b)} onChange={() => setBrands((bs) => bs.includes(b) ? bs.filter((x) => x !== b) : [...bs, b])} className="accent-primary" />
                  {b}
                </label>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="text-xs uppercase tracking-widest text-primary mb-3">Rating</h3>
            {[4.5, 4, 3.5, 0].map((r) => (
              <label key={r} className="flex items-center gap-2 text-sm">
                <input type="radio" checked={minRating === r} onChange={() => setMinRating(r)} className="accent-primary" />
                {r === 0 ? "All" : `${r}★ & up`}
              </label>
            ))}
          </div>
        </aside>
        <div>
          {filtered.length === 0 ? (
            <div className="py-24 text-center text-muted-foreground">No products match your filters.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filtered.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}