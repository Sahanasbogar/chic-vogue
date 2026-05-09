export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl gold-text">FashionHub</h3>
          <p className="mt-3 text-xs text-muted-foreground">Luxury redefined. Curated styles from the world's leading houses, delivered to your doorstep.</p>
        </div>
        {[
          { t: "Shop", l: ["Men", "Women", "Kids", "Watches", "Jewelry"] },
          { t: "Help", l: ["Contact", "Shipping", "Returns", "Size Guide", "FAQs"] },
          { t: "Company", l: ["About", "Careers", "Press", "Sustainability", "Privacy"] },
        ].map((c) => (
          <div key={c.t}>
            <p className="text-xs uppercase tracking-widest text-primary">{c.t}</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {c.l.map((x) => <li key={x} className="hover:text-foreground cursor-pointer">{x}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} FashionHub · Crafted with care.</div>
    </footer>
  );
}