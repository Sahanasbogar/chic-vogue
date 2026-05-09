import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/_app")({ component: AppLayout });

function AppLayout() {
  const { user, ready } = useStore();
  const nav = useNavigate();
  useEffect(() => { if (ready && !user) nav({ to: "/login", replace: true }); }, [user, ready, nav]);
  if (!ready || !user) {
    return <div className="min-h-screen grid place-items-center bg-background"><div className="font-display text-2xl gold-text animate-pulse">Loading…</div></div>;
  }
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main key={typeof window !== "undefined" ? window.location.pathname : "x"}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }} className="flex-1">
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <Chatbot />
    </div>
  );
}