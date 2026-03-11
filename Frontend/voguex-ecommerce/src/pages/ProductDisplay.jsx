import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

export default function ProductDisplay() {
  const { category } = useParams();
  const [sort, setSort] = useState("newest");
  const [showSort, setShowSort] = useState(false);

  const filtered = useMemo(() => {
    let items = category
      ? products.filter((p) => p.category === category.toLowerCase())
      : products;

    switch (sort) {
      case "price_asc":
        return [...items].sort((a, b) => a.price - b.price);
      case "price_desc":
        return [...items].sort((a, b) => b.price - a.price);
      case "rating":
        return [...items].sort((a, b) => b.rating - a.rating);
      default:
        return items;
    }
  }, [category, sort]);

  const title =
    category
      ? category.charAt(0).toUpperCase() + category.slice(1)
      : "All Products";

  const currentSort = sortOptions.find((s) => s.value === sort);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-white/40 text-sm uppercase tracking-widest mb-1">
            Collection
          </p>
          <h1 className="text-3xl font-display font-black text-white">
            {title}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {filtered.length} items
          </p>
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-2 px-4 py-2.5 border border-white/20 rounded text-sm text-white/70 hover:border-white/40 transition-colors"
          >
            <SlidersHorizontal size={14} />
            {currentSort.label}
            <ChevronDown size={14} className={showSort ? "rotate-180" : ""} />
          </button>

          {showSort && (
            <div className="absolute right-0 top-full mt-1 bg-[#1e1d1d] border border-white/10 rounded shadow-xl z-10 min-w-[180px]">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSort(opt.value);
                    setShowSort(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    sort === opt.value
                      ? "text-[#c9a96e] bg-[#c9a96e]/10"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {["All", "Women", "Men", "Kids", "Shoes", "Accessories", "Offers"].map((cat) => {
          const isActive =
            (!category && cat === "All") ||
            category?.toLowerCase() === cat.toLowerCase();
          return (
            <a
              key={cat}
              href={cat === "All" ? "/" : `/category/${cat.toLowerCase()}`}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase border transition-all ${
                isActive
                  ? "bg-[#c9a96e] text-black border-[#c9a96e]"
                  : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
              }`}
            >
              {cat}
            </a>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-white/30">
          <p className="text-xl">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
