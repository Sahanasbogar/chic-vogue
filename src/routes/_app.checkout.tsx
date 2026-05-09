import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, type Address } from "@/lib/store";
import { findProduct } from "@/lib/products";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/checkout")({ component: Checkout });

function Checkout() {
  const { user, cart, addAddress, placeOrder } = useStore();
  const nav = useNavigate();
  const items = cart.map((c) => ({ ...c, p: findProduct(c.productId)! })).filter((x) => x.p);
  const total = items.reduce((a, b) => a + b.p.price * b.qty, 0);
  const [pay, setPay] = useState<"upi" | "card" | "cod" | "wallet">("upi");
  const [selAddr, setSelAddr] = useState<string>(user?.addresses.find((a) => a.isDefault)?.id ?? user?.addresses[0]?.id ?? "");
  const [showAdd, setShowAdd] = useState(false);
  const [na, setNa] = useState({ label: "Home", line1: "", city: "", state: "", pincode: "", phone: "" });
  const [done, setDone] = useState<string | null>(null);

  if (items.length === 0 && !done) return <div className="py-24 text-center"><Link to="/home" className="text-primary">Continue shopping →</Link></div>;

  const place = () => {
    const addr = user?.addresses.find((a) => a.id === selAddr);
    if (!addr) return;
    const o = placeOrder(total, addr);
    setDone(o.id);
  };

  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-md py-24 text-center px-6">
      <CheckCircle2 size={64} className="mx-auto text-primary" />
      <h1 className="font-display text-3xl mt-4">Order placed!</h1>
      <p className="text-muted-foreground mt-2">Order ID: <span className="text-primary">{done}</span></p>
      <div className="mt-6 flex gap-3 justify-center">
        <Link to="/orders" className="px-5 py-2.5 rounded-full gold-bg text-primary-foreground text-sm font-semibold">Track order</Link>
        <Link to="/home" className="px-5 py-2.5 rounded-full glass text-sm font-semibold">Continue</Link>
      </div>
    </motion.div>
  );

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12 py-10 grid lg:grid-cols-[1fr_360px] gap-8">
      <div className="space-y-6">
        <section className="glass rounded-2xl p-6">
          <h2 className="font-display text-xl mb-4">Delivery Address</h2>
          {user?.addresses.length === 0 && <p className="text-sm text-muted-foreground mb-3">No saved address. Add one below.</p>}
          <div className="space-y-2">
            {user?.addresses.map((a) => (
              <label key={a.id} className={`block glass rounded-xl p-3 border cursor-pointer ${selAddr === a.id ? "border-primary" : "border-border"}`}>
                <div className="flex items-start gap-2 text-sm">
                  <input type="radio" checked={selAddr === a.id} onChange={() => setSelAddr(a.id)} className="mt-1 accent-primary" />
                  <div>
                    <p className="font-semibold">{a.label} {a.isDefault && <span className="text-[10px] text-primary">DEFAULT</span>}</p>
                    <p className="text-xs text-muted-foreground">{a.line1}, {a.city}, {a.state} {a.pincode} · {a.phone}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {!showAdd ? (
            <button onClick={() => setShowAdd(true)} className="mt-3 text-sm text-primary">+ Add new address</button>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["label", "line1", "city", "state", "pincode", "phone"] as const).map((k) => (
                <input key={k} placeholder={k} value={na[k]} onChange={(e) => setNa({ ...na, [k]: e.target.value })} className="bg-input rounded-lg px-3 py-2 text-sm border border-border focus:border-primary outline-none" />
              ))}
              <button onClick={() => { addAddress(na as Omit<Address, "id">); setShowAdd(false); setNa({ label: "Home", line1: "", city: "", state: "", pincode: "", phone: "" }); }}
                className="col-span-2 py-2 rounded-lg gold-bg text-primary-foreground text-sm font-semibold">Save address</button>
            </div>
          )}
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-display text-xl mb-4">Payment</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "upi", t: "UPI" }, { id: "card", t: "Credit / Debit" }, { id: "cod", t: "Cash on Delivery" }, { id: "wallet", t: "Wallet" },
            ].map((m) => (
              <button key={m.id} onClick={() => setPay(m.id as typeof pay)}
                className={`py-3 rounded-xl border text-sm ${pay === m.id ? "border-primary text-primary" : "border-border"}`}>{m.t}</button>
            ))}
          </div>
        </section>
      </div>

      <aside className="glass rounded-2xl p-6 h-fit sticky top-24">
        <h2 className="font-display text-xl mb-3">Summary</h2>
        <div className="space-y-2 text-sm max-h-64 overflow-auto pr-1">
          {items.map((it) => (
            <div key={it.productId} className="flex gap-2">
              <img src={it.p.image} className="h-12 w-10 object-cover rounded" alt="" />
              <div className="flex-1 text-xs">{it.p.title} × {it.qty}</div>
              <div className="text-xs">₹{(it.p.price * it.qty).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="border-t border-border/40 my-3" />
        <div className="flex justify-between text-lg font-semibold"><span>Total</span><span className="gold-text">₹{total.toLocaleString()}</span></div>
        <button onClick={place} disabled={!selAddr} className="mt-4 w-full py-3 rounded-xl gold-bg text-primary-foreground font-semibold disabled:opacity-50">Place Order</button>
      </aside>
    </div>
  );
}