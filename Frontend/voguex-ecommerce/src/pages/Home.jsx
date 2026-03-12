import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Shield, Truck } from "lucide-react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

const featured = products.slice(0, 4);

const categories = [
  {
    label: "Women",
    path: "/category/women",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
    desc: "Effortless elegance",
  },
  {
    label: "Men",
    path: "/category/men",
    image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&q=80",
    desc: "Sharp & refined",
  },
  {
    label: "Kids",
    path: "/category/kids",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80",
    desc: "Playful & comfortable",
  },
  {
    label: "Shoes",
    path: "/category/shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    desc: "Step in style",
  },
  {
    label: "Accessories",
    path: "/category/accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    desc: "Complete your look",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=80"
            alt="Hero"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0e0e] via-[#0f0e0e]/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-xl">
            <p className="text-[#c9a96e] text-sm tracking-[0.3em] uppercase font-semibold mb-4">
              Spring Collection 2026
            </p>
            <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-none mb-6">
              Dress For
              <br />
              <span className="text-[#c9a96e]">Every</span>
              <br />
              Moment.
            </h1>
            <p className="text-white/60 text-lg mb-10 leading-relaxed">
              Curated fashion for every occasion. Premium quality, timeless
              style, delivered to your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/category/women"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a96e] text-black font-semibold uppercase tracking-wider text-sm rounded hover:bg-[#d4b87d] transition-colors"
              >
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link
                to="/category/offers"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-semibold uppercase tracking-wider text-sm rounded hover:border-white/60 transition-colors"
              >
                View Offers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-y border-white/10 bg-[#141313]">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-3 gap-4">
          {[
            { icon: Truck, label: "Free Shipping", desc: "On orders over $100" },
            { icon: Shield, label: "Secure Payment", desc: "100% protected" },
            { icon: TrendingUp, label: "New Arrivals", desc: "Every week" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={20} className="text-[#c9a96e] shrink-0" />
              <div>
                <p className="text-white text-sm font-semibold">{label}</p>
                <p className="text-white/40 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-display font-bold text-white">
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              to={cat.path}
              className="group relative aspect-[4/5] rounded-lg overflow-hidden"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-white/60 text-xs tracking-widest uppercase mb-1">
                  {cat.desc}
                </p>
                <h3 className="text-white text-2xl font-display font-bold mb-3">
                  {cat.label}
                </h3>
                <span className="inline-flex items-center gap-2 text-[#c9a96e] text-sm font-medium group-hover:gap-3 transition-all">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-display font-bold text-white">
            Featured Picks
          </h2>
          <Link
            to="/"
            className="text-[#c9a96e] text-sm flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Offers Banner */}
      <section className="bg-[#c9a96e]/10 border-y border-[#c9a96e]/20 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[#c9a96e] tracking-widest text-sm uppercase mb-3">
            Limited Time
          </p>
          <h2 className="text-4xl font-display font-black text-white mb-4">
            Up to 50% Off
          </h2>
          <p className="text-white/50 mb-8">
            Don't miss our season-end sale. Premium styles at unbeatable prices.
          </p>
          <Link
            to="/category/offers"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a96e] text-black font-semibold uppercase tracking-wider text-sm rounded hover:bg-[#d4b87d] transition-colors"
          >
            Shop Offers <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
