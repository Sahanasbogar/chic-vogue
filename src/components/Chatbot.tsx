import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Msg { from: "bot" | "user"; text: string; }

const QUICK = ["Track my order", "Return policy", "Trending styles", "Delivery time", "Payment options"];

function answer(q: string): string {
  const t = q.toLowerCase();
  const has = (...k: string[]) => k.some((x) => t.includes(x));
  if (has("hi", "hello", "hey")) return "Hi! I'm Lumi, your FashionHub assistant. Ask me about products, orders, delivery, or returns.";
  if (has("track", "order status", "where is my order")) return "Visit My Orders to view a live status timeline: Ordered → Packed → Shipped → Out for delivery → Delivered.";
  if (has("return", "refund", "exchange")) return "Easy 7-day returns on all unworn items with original tags. Refunds reach your account in 3–5 business days.";
  if (has("delivery", "shipping", "when will")) return "Standard delivery: 3–5 business days. Express: 1–2 days. Free shipping on orders over ₹2,000.";
  if (has("payment", "upi", "card", "cod", "wallet")) return "We accept UPI, credit/debit cards, wallets, and Cash on Delivery (under ₹10,000).";
  if (has("login", "sign up", "signup", "account")) return "Tap Login on the top right. New here? Use Sign Up — your email and mobile must be unique.";
  if (has("cart", "bag")) return "Items in your bag are saved automatically. Add coupons at checkout for extra savings.";
  if (has("wishlist")) return "Heart any product to wishlist it. Find them all under the heart icon in the navbar.";
  if (has("trending", "popular", "best")) return "Check the Trending section on the home page or the Bestseller badges across categories.";
  if (has("size", "fit")) return "Each product page has a size selector. When unsure, size up — our fits run true to size.";
  if (has("category", "men", "women", "kids", "watch", "beauty", "bag", "jewel")) return "Browse categories from the navbar — Men, Women, Kids, Watches, Footwear, Beauty, Bags, Jewelry, Accessories.";
  if (has("contact", "support", "help")) return "Reach our concierge at care@fashionhub.example or via the chat — Mon–Sun, 9am–9pm IST.";
  if (has("offer", "discount", "sale", "coupon")) return "Visit the Offers page for active deals. Use code LUXE10 for 10% off on your first order.";
  if (has("recommend", "suggest", "what should i")) return "For everyday luxe try our Court Sneakers + Linen Resort Shirt combo. For evenings, the Satin Slip Dress with Stiletto Pumps is unbeatable.";
  return "I can only help with fashion store related queries.";
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Hi! I'm Lumi ✨ Your FashionHub assistant. How can I help today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: "user", text }]);
    setInput(""); setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", text: answer(text) }]);
      setTyping(false);
    }, 700);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-6 z-50 grid place-items-center h-14 w-14 rounded-full gold-bg text-primary-foreground luxe-shadow"
        aria-label="Chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 h-[70vh] sm:h-[520px] glass rounded-3xl flex flex-col overflow-hidden luxe-shadow"
          >
            <div className="p-4 border-b border-border/40 flex items-center gap-2">
              <div className="h-9 w-9 rounded-full gold-bg grid place-items-center text-primary-foreground">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="font-display text-base">Lumi</p>
                <p className="text-[10px] text-muted-foreground">Fashion Concierge · Online</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from === "user" ? "gold-bg text-primary-foreground" : "bg-muted text-foreground"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl px-3 py-2 text-sm flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
            <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
              {QUICK.map((q) => (
                <button key={q} onClick={() => send(q)} className="text-[11px] px-2.5 py-1 rounded-full border border-primary/40 hover:bg-primary/10 transition">
                  {q}
                </button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-3 border-t border-border/40 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your order, returns…"
                className="flex-1 rounded-full bg-muted px-4 py-2 text-sm border border-border/60 focus:outline-none focus:border-primary" />
              <button type="submit" className="grid place-items-center h-9 w-9 rounded-full gold-bg text-primary-foreground"><Send size={14} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}