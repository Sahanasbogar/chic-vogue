import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: Login });

const SLIDES = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80",
];
const SLOGANS = ["Luxury Redefined", "Wear Your Style", "Fashion Beyond Trends"];

function Login() {
  const { login, user, ready } = useStore();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState("");
  const [slide, setSlide] = useState(0);

  useEffect(() => { if (ready && user) nav({ to: "/home", replace: true }); }, [user, ready, nav]);
  useEffect(() => { const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 4500); return () => clearInterval(t); }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!email || !password) { setErr("Please fill all fields"); return; }
    const r = login(email, password);
    if (!r.ok) { setErr(r.error ?? "Login failed"); return; }
    toast.success("Welcome back");
    nav({ to: "/home" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="relative hidden lg:block overflow-hidden">
        {SLIDES.map((s, i) => (
          <motion.div key={s}
            initial={false}
            animate={{ opacity: i === slide ? 1 : 0, scale: i === slide ? 1 : 1.08 }}
            transition={{ duration: 1.6 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${s})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/70 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-between p-12">
          <Link to="/login" className="font-display text-3xl gold-text">FashionHub</Link>
          <motion.div key={slide} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-3">
            <Sparkles className="text-primary" size={28} />
            <h2 className="font-display text-5xl xl:text-6xl text-foreground leading-tight">{SLOGANS[slide]}</h2>
            <p className="text-muted-foreground max-w-md">Curated luxury, delivered. Step into a world of timeless silhouettes and signature craftsmanship.</p>
          </motion.div>
        </div>
      </div>

      <div className="relative grid place-items-center p-6 sm:p-12">
        <div className="absolute inset-0 lg:hidden bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${SLIDES[0]})` }} />
        <motion.form onSubmit={submit}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative w-full max-w-md glass rounded-3xl p-8 luxe-shadow">
          <h1 className="font-display text-3xl">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to continue your journey.</p>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email"
                className="w-full rounded-xl bg-input pl-10 pr-3 py-3 text-sm border border-border focus:outline-none focus:border-primary" />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} placeholder="Password"
                className="w-full rounded-xl bg-input pl-10 pr-10 py-3 text-sm border border-border focus:outline-none focus:border-primary" />
              <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-primary" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
            </div>

            {err && <p className="text-xs text-destructive">{err}</p>}

            <button type="submit" className="w-full py-3 rounded-xl gold-bg text-primary-foreground font-semibold tracking-wide hover:opacity-90 transition">
              Sign In
            </button>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" />
            </div>

            <button type="button" className="w-full py-3 rounded-xl border border-border bg-card hover:bg-muted text-sm flex items-center justify-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6 29.1 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5 0 9.6-1.9 13-5l-6-5.1c-1.9 1.4-4.3 2.1-7 2.1-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.6 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.8l6 5.1C40.2 35.5 44 30.3 44 24c0-1.2-.1-2.3-.4-3.5z"/></svg>
              Continue with Google
            </button>

            <p className="text-center text-xs text-muted-foreground">
              New to FashionHub? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}