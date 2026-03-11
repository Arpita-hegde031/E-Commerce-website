import { ShoppingBag, Star, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group relative bg-[#181717] rounded-lg overflow-hidden border border-white/5 hover:border-[#c9a96e]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#c9a96e]/10">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-[#1e1e1e]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Tag */}
        {product.tag && (
          <span
            className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded ${
              product.tag.includes("OFF")
                ? "bg-red-500 text-white"
                : product.tag === "New"
                ? "bg-[#c9a96e] text-black"
                : "bg-white/10 text-white backdrop-blur-sm"
            }`}
          >
            {product.tag}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setWished(!wished)}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/70"
        >
          <Heart
            size={14}
            className={wished ? "fill-red-400 text-red-400" : "text-white"}
          />
        </button>

        {/* Add to Cart overlay button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAdd}
            className={`w-full py-2.5 text-sm font-semibold tracking-wider uppercase rounded transition-all duration-200 flex items-center justify-center gap-2 ${
              added
                ? "bg-green-500 text-white"
                : "bg-[#c9a96e] text-black hover:bg-[#d4b87d]"
            }`}
          >
            <ShoppingBag size={14} />
            {added ? "Added!" : "Add to Bag"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white font-medium text-sm leading-tight truncate mb-1">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className={
                  i < Math.floor(product.rating)
                    ? "fill-[#c9a96e] text-[#c9a96e]"
                    : "text-white/20"
                }
              />
            ))}
          </div>
          <span className="text-white/40 text-xs">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-white font-bold">${product.price}</span>
          {product.originalPrice && (
            <span className="text-white/40 text-sm line-through">
              ${product.originalPrice}
            </span>
          )}
          {discount && (
            <span className="text-red-400 text-xs font-medium">-{discount}%</span>
          )}
        </div>

        {/* Color Swatches */}
        {product.colors && (
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.map((color, i) => (
              <div
                key={i}
                style={{ backgroundColor: color }}
                className="w-3 h-3 rounded-full border border-white/20"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
