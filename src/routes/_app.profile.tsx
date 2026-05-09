import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, type Address } from "@/lib/store";
import { toast } from "sonner";
import { Edit2, Trash2, Star } from "lucide-react";

export const Route = createFileRoute("/_app/profile")({ component: Profile });

function Profile() {
  const { user, updateUser, addAddress, updateAddress, deleteAddress, setDefaultAddress, orders, wishlist, cart } = useStore();
  const [f, setF] = useState({ fullName: user!.fullName, email: user!.email, mobile: user!.mobile, password: user!.password, avatar: user!.avatar ?? "" });
  const [editAddr, setEditAddr] = useState<Address | null>(null);
  const [newAddr, setNewAddr] = useState({ label: "Home", line1: "", city: "", state: "", pincode: "", phone: "" });
  const [showAdd, setShowAdd] = useState(false);

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader(); r.onload = () => setF({ ...f, avatar: r.result as string }); r.readAsDataURL(file);
  };
  const save = () => { updateUser(f); toast.success("Profile updated"); };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: "Orders", v: orders.length }, { l: "Wishlist", v: wishlist.length },
          { l: "Bag", v: cart.reduce((a, b) => a + b.qty, 0) }, { l: "Addresses", v: user!.addresses.length },
        ].map((s) => (
          <div key={s.l} className="glass rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-primary">{s.l}</p>
            <p className="font-display text-3xl mt-1">{s.v}</p>
          </div>
        ))}
      </div>
      <section className="glass rounded-3xl p-6 grid md:grid-cols-[160px_1fr] gap-6">
        <label className="cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
          <div className="h-36 w-36 rounded-2xl overflow-hidden bg-muted border-2 border-primary/40 grid place-items-center text-xs text-muted-foreground">
            {f.avatar ? <img src={f.avatar} alt="" className="h-full w-full object-cover" /> : "Upload"}
          </div>
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          {(["fullName", "email", "mobile", "password"] as const).map((k) => (
            <div key={k}>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</label>
              <input value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} type={k === "password" ? "password" : "text"}
                className="w-full mt-1 bg-input rounded-lg px-3 py-2 text-sm border border-border focus:border-primary outline-none" />
            </div>
          ))}
          <button onClick={save} className="sm:col-span-2 mt-2 py-2.5 rounded-xl gold-bg text-primary-foreground font-semibold">Save changes</button>
        </div>
      </section>
      <section className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl">Saved Addresses</h2>
          <button onClick={() => setShowAdd((v) => !v)} className="text-sm text-primary">+ Add address</button>
        </div>
        {showAdd && (
          <div className="grid sm:grid-cols-2 gap-2 mb-4">
            {(["label", "line1", "city", "state", "pincode", "phone"] as const).map((k) => (
              <input key={k} placeholder={k} value={newAddr[k]} onChange={(e) => setNewAddr({ ...newAddr, [k]: e.target.value })} className="bg-input rounded-lg px-3 py-2 text-sm border border-border focus:border-primary outline-none" />
            ))}
            <button onClick={() => { addAddress(newAddr); setShowAdd(false); setNewAddr({ label: "Home", line1: "", city: "", state: "", pincode: "", phone: "" }); toast.success("Address added"); }}
              className="sm:col-span-2 py-2 rounded-lg gold-bg text-primary-foreground text-sm font-semibold">Save</button>
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-3">
          {user!.addresses.map((a) => (
            <div key={a.id} className="glass rounded-xl p-4">
              {editAddr?.id === a.id ? (
                <div className="grid grid-cols-2 gap-2">
                  {(["label", "line1", "city", "state", "pincode", "phone"] as const).map((k) => (
                    <input key={k} value={editAddr[k]} onChange={(e) => setEditAddr({ ...editAddr!, [k]: e.target.value })} className="bg-input rounded-lg px-2 py-1.5 text-sm border border-border focus:border-primary outline-none" />
                  ))}
                  <button onClick={() => { updateAddress(editAddr); setEditAddr(null); toast.success("Updated"); }} className="col-span-2 py-1.5 rounded-lg gold-bg text-primary-foreground text-sm">Save</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{a.label} {a.isDefault && <span className="text-[10px] text-primary ml-1">DEFAULT</span>}</p>
                    <div className="flex gap-2">
                      {!a.isDefault && <button onClick={() => setDefaultAddress(a.id)} title="Set default"><Star size={14} /></button>}
                      <button onClick={() => setEditAddr(a)}><Edit2 size={14} /></button>
                      <button onClick={() => deleteAddress(a.id)} className="text-destructive"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{a.line1}, {a.city}, {a.state} {a.pincode}</p>
                  <p className="text-xs text-muted-foreground">{a.phone}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}