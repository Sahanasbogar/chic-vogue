import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";
import { findProduct } from "@/lib/products";

export const Route = createFileRoute("/_app/wishlist")({ component: Wishlist });

function Wishlist() {
  const { wishlist } = useStore();
  const items = wishlist.map(findProduct).filter(Boolean) as NonNullable<ReturnType<typeof findProduct>>[];
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12 py-10">
      <h1 className="font-display text-3xl mb-6">Your Wishlist</h1>
      {items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-muted-foreground">Nothing saved yet.</p>
          <Link to="/home" className="mt-4 inline-block px-5 py-2 rounded-full gold-bg text-primary-foreground text-sm font-semibold">Browse</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}