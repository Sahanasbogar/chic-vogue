import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user, ready } = useStore();
  const nav = useNavigate();
  useEffect(() => {
    if (!ready) return;
    nav({ to: user ? "/home" : "/login", replace: true });
  }, [user, ready, nav]);
  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="font-display text-4xl gold-text animate-pulse">FashionHub</div>
    </div>
  );
}
