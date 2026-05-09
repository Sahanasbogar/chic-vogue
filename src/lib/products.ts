export type Category =
  | "men" | "women" | "kids" | "watches" | "footwear"
  | "beauty" | "bags" | "jewelry" | "accessories";

export interface Product {
  id: string;
  title: string;
  category: Category;
  gender: "men" | "women" | "kids" | "unisex";
  brand: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  hoverImage: string;
  sizes: string[];
  colors: string[];
  stock: number;
  badge?: "Trending" | "Bestseller" | "Exclusive" | "New" | "Limited";
  description: string;
}

const img = (id: string, w = 700) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const make = (
  i: number,
  title: string,
  category: Category,
  gender: Product["gender"],
  brand: string,
  price: number,
  imgIds: [string, string],
  opts: Partial<Product> = {}
): Product => {
  const oldPrice = Math.round(price * (1 + (15 + (i % 40)) / 100));
  const discount = Math.round(((oldPrice - price) / oldPrice) * 100);
  return {
    id: `${category}-${i}`,
    title, category, gender, brand, price, oldPrice, discount,
    rating: 3.8 + ((i * 13) % 12) / 10,
    reviews: 40 + ((i * 37) % 900),
    image: img(imgIds[0]),
    hoverImage: img(imgIds[1]),
    sizes: opts.sizes ?? (["men","women","kids"].includes(gender) ? ["S","M","L","XL"] : ["Free"]),
    colors: opts.colors ?? ["#0a0a0a", "#b8860b", "#8b0000"],
    stock: 5 + (i % 50),
    badge: opts.badge ?? (["Trending","Bestseller","Exclusive","New","Limited"] as const)[i % 5],
    description: `${brand} ${title}. Crafted from premium materials with attention to every detail. Perfect blend of comfort and luxury.`,
  };
};

// Curated Unsplash photo IDs per category (real fashion imagery)
const MEN: [string, string][] = [
  ["1602810318383-e386cc2a3ccf","1521572163474-6864f9cf17ab"], // shirts
  ["1521572163474-6864f9cf17ab","1618354691373-d851c5c3a990"],
  ["1556905055-8f358a7a47b2","1620799140408-edc6dcb6d633"], // hoodie
  ["1591047139829-d91aecb6caea","1551028719-00167b16eac5"], // jacket
  ["1542272604-787c3835535d","1604176354204-9268737828e4"], // jeans
  ["1542291026-7eec264c27ff","1600185365483-26d7a4cc7519"], // sneakers
  ["1523275335684-37898b6baf30","1495856458515-0637185db551"], // watch men
  ["1541643600914-78b084683601","1594035910387-fea47794261f"], // perfume
];
const WOMEN: [string, string][] = [
  ["1610030469983-98e550d6193c","1583391733956-3750e0ff4e8b"], // saree
  ["1539008835657-9e8e9680c956","1572804013427-4d7ca7268217"], // dress
  ["1591561954557-26941169b49e","1584917865442-de89df76afd3"], // handbag
  ["1543163521-1bf539c55dd2","1543163521-1bf539c55dd2"], // heels
  ["1522335789203-aabd1fc54bc9","1487412947147-5cebf100ffc2"], // makeup
  ["1599643478518-a784e5dc4c8f","1602173574767-37ac01994b2a"], // jewelry
  ["1556228720-195a672e8a03","1570194065650-d99fb4bedf0a"], // skincare
];
const KIDS: [string, string][] = [
  ["1503944583220-79d8926ad5e2","1519457431-44ccd64a579b"], // kids wear
  ["1558877385-81a1c7e67d72","1596466713836-bcc1f8c1c3c4"], // kids wear 2
  ["1566576912321-d58ddd7a6088","1558060370-d644479cb6f7"], // toys
  ["1514989940723-e8e51635b782","1514989940723-e8e51635b782"], // kids shoes
  ["1553062407-98eeb64c6a62","1564466809058-bf4114d55352"], // school bag
];
const WATCHES: [string, string][] = [
  ["1524592094714-0f0654e20314","1547996160-81dfa63595aa"],
  ["1434056886845-dac89ffe9b56","1495856458515-0637185db551"],
  ["1539874754764-5a96559165b0","1533139502658-0198f920d8e8"],
  ["1508057198894-247b23fe5ade","1508057198894-247b23fe5ade"],
  ["1622434641406-a158123450f9","1606293926249-ed22f807f5e6"],
];
const FOOTWEAR: [string, string][] = [
  ["1542291026-7eec264c27ff","1600185365483-26d7a4cc7519"],
  ["1595950653106-6c9ebd614d3a","1606107557195-0e29a4b5b4aa"],
  ["1520639888713-7851133b1ed0","1520975661595-6453be3f7070"], // boots
  ["1543163521-1bf539c55dd2","1581101767113-1677fc2beaa8"], // heels
  ["1614252369475-531eba835eb1","1533867617858-e7b97e060509"], // formal
];
const BEAUTY: [string, string][] = [
  ["1586495777744-4413f21062fa","1522335789203-aabd1fc54bc9"], // lipstick
  ["1541643600914-78b084683601","1594035910387-fea47794261f"], // perfume
  ["1487412947147-5cebf100ffc2","1522335789203-aabd1fc54bc9"], // cosmetics
  ["1559599101-f09722fb4948","1526045478516-99145907023c"], // haircare
  ["1556228720-195a672e8a03","1570194065650-d99fb4bedf0a"], // skincare
];
const BAGS: [string, string][] = [
  ["1591561954557-26941169b49e","1584917865442-de89df76afd3"], // handbag
  ["1553062407-98eeb64c6a62","1581605405669-fcdf81165afa"], // travel
  ["1553062407-98eeb64c6a62","1622560480605-d83c853bc5c4"], // backpack
  ["1548036328-c9fa89d128fa","1564422170194-896b89110ef8"], // sling
];
const JEWELRY: [string, string][] = [
  ["1605100804763-247f67b3557e","1599643478518-a784e5dc4c8f"], // ring
  ["1599643478518-a784e5dc4c8f","1602173574767-37ac01994b2a"], // necklace
  ["1535632066927-ab7c9ab60908","1611591437281-460bfbe1220a"], // earring
  ["1611652022419-a9419f74343d","1602173574767-37ac01994b2a"], // bracelet
];
const ACC: [string, string][] = [
  ["1572635196237-14b3f281503f","1511499767150-a48a237f0083"], // sunglasses
  ["1627123424574-724758594e93","1559563458-527698bf5295"], // wallet
  ["1624222247344-550fb60583dc","1624222247344-550fb60583dc"], // belt
  ["1521369909029-2afed882baee","1588850561407-ed78c282e89b"], // cap
  ["1601244005535-a48d21d951ac","1601244005535-a48d21d951ac"], // scarf
];

const buildSet = (
  items: { title: string; brand: string; price: number; }[],
  imgs: [string, string][],
  category: Category,
  gender: Product["gender"],
  startIdx: number,
) => items.flatMap((it, k) => {
  // Generate 3 color/price variants per base item to ensure many products
  return [0, 1, 2].map((v) => make(
    startIdx + k * 3 + v,
    v === 0 ? it.title : `${it.title} - ${["Premium","Limited","Signature"][v - 1] ?? ""}`.trim(),
    category, gender, it.brand,
    Math.round(it.price * (1 + v * 0.25)),
    imgs[(k + v) % imgs.length],
  ));
});

export const PRODUCTS: Product[] = [
  ...buildSet([
    { title: "Oxford Slim Shirt", brand: "Aurelius", price: 1899 },
    { title: "Linen Resort Shirt", brand: "Maison Noir", price: 2499 },
    { title: "Velour Hoodie", brand: "Atelier 21", price: 3299 },
    { title: "Aviator Bomber Jacket", brand: "Norcroft", price: 5499 },
    { title: "Selvedge Denim Jeans", brand: "Indigo Co.", price: 2899 },
    { title: "Court Sneakers", brand: "Vellum", price: 4299 },
    { title: "Chronograph Watch", brand: "Heritage", price: 7999 },
    { title: "Oud Eau de Parfum", brand: "Noir Privé", price: 3499 },
  ], MEN, "men", "men", 100),
  ...buildSet([
    { title: "Banarasi Silk Saree", brand: "Rasa", price: 5999 },
    { title: "Satin Slip Dress", brand: "Lume", price: 3499 },
    { title: "Quilted Tote Handbag", brand: "Maison Noir", price: 4799 },
    { title: "Stiletto Pumps", brand: "Vellum", price: 3999 },
    { title: "Velvet Lipstick Set", brand: "Lustre", price: 1499 },
    { title: "Diamond Drop Earrings", brand: "Aurum", price: 8999 },
    { title: "Glow Serum 30ml", brand: "Pure&Co", price: 1899 },
  ], WOMEN, "women", "women", 200),
  ...buildSet([
    { title: "Cotton Play Set", brand: "Tinytales", price: 999 },
    { title: "Striped Tee & Shorts", brand: "Tinytales", price: 1199 },
    { title: "Wooden Stacking Toy", brand: "Bloom", price: 799 },
    { title: "Velcro Sneakers", brand: "Stride Jr", price: 1399 },
    { title: "Animal School Backpack", brand: "Bloom", price: 1599 },
  ], KIDS, "kids", "kids", 300),
  ...buildSet([
    { title: "Automatic Skeleton Watch", brand: "Heritage", price: 12999 },
    { title: "Smart Active Watch", brand: "Pulse", price: 8999 },
    { title: "Leather Analog Watch", brand: "Aurelius", price: 5499 },
    { title: "Carbon Sport Watch", brand: "Norcroft", price: 6799 },
    { title: "Rose Gold Dress Watch", brand: "Aurum", price: 9499 },
  ], WATCHES, "watches", "unisex", 400),
  ...buildSet([
    { title: "Runner X Sneakers", brand: "Vellum", price: 4499 },
    { title: "Suede Low-Top", brand: "Atelier 21", price: 3899 },
    { title: "Chelsea Boots", brand: "Aurelius", price: 6299 },
    { title: "Block Heel Sandals", brand: "Lume", price: 2899 },
    { title: "Oxford Formal Shoes", brand: "Heritage", price: 5499 },
  ], FOOTWEAR, "footwear", "unisex", 500),
  ...buildSet([
    { title: "Matte Liquid Lipstick", brand: "Lustre", price: 899 },
    { title: "Amber Eau de Parfum", brand: "Noir Privé", price: 3299 },
    { title: "Glow Foundation 30ml", brand: "Lustre", price: 1599 },
    { title: "Argan Hair Mask", brand: "Pure&Co", price: 1199 },
    { title: "Vitamin C Serum", brand: "Pure&Co", price: 1799 },
  ], BEAUTY, "beauty", "unisex", 600),
  ...buildSet([
    { title: "Quilted Shoulder Bag", brand: "Maison Noir", price: 4499 },
    { title: "Weekender Travel Duffel", brand: "Norcroft", price: 5299 },
    { title: "Tech Backpack 22L", brand: "Atelier 21", price: 3499 },
    { title: "Crossbody Sling", brand: "Lume", price: 1999 },
  ], BAGS, "bags", "unisex", 700),
  ...buildSet([
    { title: "Solitaire Diamond Ring", brand: "Aurum", price: 18999 },
    { title: "Pearl Layered Necklace", brand: "Aurum", price: 7999 },
    { title: "Hoop Gold Earrings", brand: "Aurum", price: 4499 },
    { title: "Tennis Bracelet", brand: "Aurum", price: 6499 },
  ], JEWELRY, "jewelry", "women", 800),
  ...buildSet([
    { title: "Aviator Sunglasses", brand: "Vue", price: 2499 },
    { title: "Bifold Leather Wallet", brand: "Aurelius", price: 1799 },
    { title: "Italian Leather Belt", brand: "Aurelius", price: 1599 },
    { title: "Wool Snapback Cap", brand: "Atelier 21", price: 999 },
    { title: "Cashmere Scarf", brand: "Maison Noir", price: 2299 },
  ], ACC, "accessories", "unisex", 900),
];

export const byCategory = (c: Category) => PRODUCTS.filter((p) => p.category === c);
export const findProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const trending = () => PRODUCTS.filter((p) => p.badge === "Trending").slice(0, 8);
export const newArrivals = () => PRODUCTS.filter((p) => p.badge === "New").slice(0, 8);
export const onOffer = () => PRODUCTS.filter((p) => p.discount >= 25).slice(0, 24);

export const CATEGORIES: { slug: Category; label: string }[] = [
  { slug: "men", label: "Men" },
  { slug: "women", label: "Women" },
  { slug: "kids", label: "Kids" },
  { slug: "beauty", label: "Beauty" },
  { slug: "watches", label: "Watches" },
  { slug: "footwear", label: "Footwear" },
  { slug: "bags", label: "Bags" },
  { slug: "jewelry", label: "Jewelry" },
  { slug: "accessories", label: "Accessories" },
];