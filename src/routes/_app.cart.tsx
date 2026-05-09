import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Tag } from "lucide-react";
import { useStore } from "@/lib/store";
import { findProduct } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/cart")({ component: Cart });

function Cart() {
  const { cart, updateCartQty, removeFromCart } = useStore();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const nav = useNavigate();
  const items = cart.map((c) => ({ ...c, p: findProduct(c.productId)! })).filter((x) => x.p);
  const subtotal = items.reduce((a, b) => a + b.p.price * b.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 99;
  const total = subtotal + tax + shipping - discount;

  const apply = () => {
    if (coupon.toUpperCase() === "LUXE10") { setDiscount(Math.round(subtotal * 0.1)); toast.success("Coupon applied: 10% off"); }
    else { setDiscount(0); toast.error("Invalid coupon"); }
  };

  if (items.length === 0) return (
    <div className="mx-auto max-w-7xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl">Your bag is empty</h1>
      <p className="text-muted-foreground mt-2">Discover something extraordinary.</p>
      <Link to="/home" className="mt-6 inline-block px-6 py-3 rounded-full gold-bg text-primary-foreground font-semibold">Continue shopping</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12 py-10 grid lg:grid-cols-[1fr_360px] gap-8">
      <div>
        <h1 className="font-display text-3xl mb-6">Your Bag ({items.length})</h1>
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.productId} className="glass rounded-2xl p-4 flex gap-4">
              <Link to="/product/$id" params={{ id: it.p.id }}><img src={it.p.image} alt="" className="h-28 w-24 object-cover rounded-lg" /></Link>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{it.p.brand}</p>
                <Link to="/product/$id" params={{ id: it.p.id }}><h3 className="text-sm font-medium hover:text-primary">{it.p.title}</h3></Link>
                <p className="text-xs text-muted-foreground">Size: {it.size} · Color: <span className="inline-block h-3 w-3 rounded-full align-middle" style={{ background: it.color }} /></p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-lg">
                    <button onClick={() => updateCartQty(it.productId, it.qty - 1)} className="px-2.5 py-1">−</button>
                    <span className="px-2.5 text-sm">{it.qty}</span>
                    <button onClick={() => updateCartQty(it.productId, it.qty + 1)} className="px-2.5 py-1">+</button>
                  </div>
                  <button onClick={() => removeFromCart(it.productId)} className="text-destructive hover:text-destructive/80 text-xs flex items-center gap-1"><Trash2 size={12} /> Remove</button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{(it.p.price * it.qty).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground line-through">₹{(it.p.oldPrice * it.qty).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <aside className="glass rounded-2xl p-6 h-fit sticky top-24">
        <h2 className="font-display text-xl mb-4">Order Summary</h2>
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon (try LUXE10)" className="w-full bg-input rounded-lg pl-9 pr-3 py-2 text-sm border border-border focus:border-primary outline-none" />
          </div>
          <button onClick={apply} className="px-4 py-2 rounded-lg gold-bg text-primary-foreground text-sm font-semibold">Apply</button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">GST (5%)</span><span>₹{tax.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping ? `₹${shipping}` : "Free"}</span></div>
          {discount > 0 && <div className="flex justify-between text-accent"><span>Discount</span><span>−₹{discount.toLocaleString()}</span></div>}
          <div className="border-t border-border/40 my-2" />
          <div className="flex justify-between text-lg font-semibold"><span>Total</span><span className="gold-text">₹{total.toLocaleString()}</span></div>
        </div>
        <button onClick={() => nav({ to: "/checkout" })} className="mt-5 w-full py-3 rounded-xl gold-bg text-primary-foreground font-semibold">Proceed to Checkout</button>
      </aside>
    </div>
  );
}