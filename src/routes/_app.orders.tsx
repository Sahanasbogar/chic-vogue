import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { findProduct } from "@/lib/products";
import { CheckCircle2, Package, Truck, MapPin, Box } from "lucide-react";

export const Route = createFileRoute("/_app/orders")({ component: Orders });

const STAGES = ["Ordered", "Packed", "Shipped", "Out for delivery", "Delivered"] as const;
const ICONS = [Box, Package, Truck, MapPin, CheckCircle2];

function Orders() {
  const { orders } = useStore();
  if (orders.length === 0) return (
    <div className="mx-auto max-w-2xl py-24 text-center">
      <h1 className="font-display text-3xl">No orders yet</h1>
      <Link to="/home" className="mt-4 inline-block text-primary">Start shopping →</Link>
    </div>
  );
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-3xl mb-6">My Orders</h1>
      <div className="space-y-6">
        {orders.map((o) => {
          const stage = STAGES.indexOf(o.status);
          return (
            <div key={o.id} className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 text-sm">
                <div>
                  <p className="font-semibold">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{new Date(o.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                </div>
                <p className="font-semibold gold-text">₹{o.total.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between relative mb-6">
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-border" />
                <div className="absolute top-4 left-4 h-0.5 gold-bg transition-all" style={{ width: `calc(${(stage / (STAGES.length - 1)) * 100}% - 16px)` }} />
                {STAGES.map((s, i) => {
                  const Icon = ICONS[i];
                  const active = i <= stage;
                  return (
                    <div key={s} className="relative z-10 flex flex-col items-center">
                      <div className={`h-9 w-9 rounded-full grid place-items-center ${active ? "gold-bg text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        <Icon size={14} />
                      </div>
                      <p className={`text-[10px] mt-1 ${active ? "text-primary" : "text-muted-foreground"}`}>{s}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 overflow-x-auto">
                {o.items.map((it) => {
                  const p = findProduct(it.productId);
                  if (!p) return null;
                  return (
                    <Link key={it.productId} to="/product/$id" params={{ id: p.id }} className="flex gap-2 min-w-[200px] glass rounded-xl p-2">
                      <img src={p.image} alt="" className="h-14 w-12 object-cover rounded" />
                      <div className="text-xs">
                        <p className="font-medium">{p.title}</p>
                        <p className="text-muted-foreground">Qty {it.qty}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}