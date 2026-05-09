import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const { signup } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({ fullName: "", email: "", mobile: "", password: "", confirm: "", gender: "female", avatar: "" });
  const [err, setErr] = useState("");

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => setF((s) => ({ ...s, avatar: r.result as string }));
    r.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (!f.fullName || !f.email || !f.mobile || !f.password) return setErr("Please fill all required fields");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr("Enter a valid email");
    if (!/^\d{10}$/.test(f.mobile)) return setErr("Mobile must be 10 digits");
    if (f.password.length < 6) return setErr("Password must be at least 6 characters");
    if (f.password !== f.confirm) return setErr("Passwords don't match");
    const r = signup({ fullName: f.fullName, email: f.email, mobile: f.mobile, password: f.password, gender: f.gender, avatar: f.avatar });
    if (!r.ok) return setErr(r.error ?? "Signup failed");
    toast.success("Welcome to FashionHub");
    nav({ to: "/home" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=1600&q=80)" }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/60 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-between p-12">
          <Link to="/login" className="font-display text-3xl gold-text">FashionHub</Link>
          <div>
            <h2 className="font-display text-5xl">Begin your journey.</h2>
            <p className="text-muted-foreground mt-2 max-w-md">Join a community of taste-makers. Members enjoy early access, private sales, and complimentary styling.</p>
          </div>
        </div>
      </div>
      <div className="grid place-items-center p-6 sm:p-10">
        <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass rounded-3xl p-8 luxe-shadow space-y-3">
          <h1 className="font-display text-3xl">Create account</h1>
          <p className="text-xs text-muted-foreground">It only takes a minute.</p>

          <div className="flex items-center gap-3 pt-2">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
              <div className="h-16 w-16 rounded-full bg-muted overflow-hidden grid place-items-center text-xs text-muted-foreground border border-primary/40">
                {f.avatar ? <img src={f.avatar} alt="" className="h-full w-full object-cover" /> : "Photo"}
              </div>
            </label>
            <p className="text-xs text-muted-foreground">Upload a profile photo (optional)</p>
          </div>

          <input value={f.fullName} onChange={(e) => setF({ ...f, fullName: e.target.value })} placeholder="Full name"
            className="w-full rounded-xl bg-input px-4 py-3 text-sm border border-border focus:outline-none focus:border-primary" />
          <input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} type="email" placeholder="Email"
            className="w-full rounded-xl bg-input px-4 py-3 text-sm border border-border focus:outline-none focus:border-primary" />
          <input value={f.mobile} onChange={(e) => setF({ ...f, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="Mobile (10 digits)"
            className="w-full rounded-xl bg-input px-4 py-3 text-sm border border-border focus:outline-none focus:border-primary" />
          <div className="grid grid-cols-2 gap-3">
            <input value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} type="password" placeholder="Password"
              className="w-full rounded-xl bg-input px-4 py-3 text-sm border border-border focus:outline-none focus:border-primary" />
            <input value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} type="password" placeholder="Confirm"
              className="w-full rounded-xl bg-input px-4 py-3 text-sm border border-border focus:outline-none focus:border-primary" />
          </div>
          <select value={f.gender} onChange={(e) => setF({ ...f, gender: e.target.value })}
            className="w-full rounded-xl bg-input px-4 py-3 text-sm border border-border focus:outline-none focus:border-primary">
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>

          {err && <p className="text-xs text-destructive">{err}</p>}

          <button type="submit" className="w-full py-3 rounded-xl gold-bg text-primary-foreground font-semibold">
            Create account
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Already a member? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}