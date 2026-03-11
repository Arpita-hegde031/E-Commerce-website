import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Star, Heart, Shield, Truck } from "lucide-react";
import { useState } from "react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-white/40">
        <p className="text-xl mb-4">Product not found</p>
        <button
          onClick={() => navigate("/")}
          className="text-[#c9a96e] hover:underline"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  // Related products (same category, exclude current)
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#181717]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.tag && (
            <span
              className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded ${
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
          <button
            onClick={() => setWished(!wished)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/70 transition-all"
          >
            <Heart
              size={18}
              className={wished ? "fill-red-400 text-red-400" : "text-white"}
            />
          </button>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2 capitalize">
            {product.category}
          </p>
          <h1 className="text-3xl font-display font-black text-white mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(product.rating)
                      ? "fill-[#c9a96e] text-[#c9a96e]"
                      : "text-white/20"
                  }
                />
              ))}
            </div>
            <span className="text-white/50 text-sm">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-white">${product.price}</span>
            {product.originalPrice && (
              <span className="text-white/40 text-xl line-through">
                ${product.originalPrice}
              </span>
            )}
            {discount && (
              <span className="bg-red-500/20 text-red-400 text-sm font-semibold px-2 py-0.5 rounded">
                -{discount}%
              </span>
            )}
          </div>

          {/* Colors */}
          {product.colors && (
            <div className="mb-6">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-3">
                Color
              </p>
              <div className="flex gap-2">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      selectedColor === i
                        ? "border-[#c9a96e] scale-110"
                        : "border-white/20 hover:border-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-3">
              Quantity
            </p>
            <div className="flex items-center border border-white/20 rounded w-fit">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2 text-white/60 hover:text-white transition-colors text-lg"
              >
                −
              </button>
              <span className="px-4 py-2 text-white font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2 text-white/60 hover:text-white transition-colors text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAdd}
            className={`w-full py-4 font-semibold uppercase tracking-wider text-sm rounded flex items-center justify-center gap-2 transition-all duration-200 mb-4 ${
              added
                ? "bg-green-500 text-white"
                : "bg-[#c9a96e] text-black hover:bg-[#d4b87d]"
            }`}
          >
            <ShoppingBag size={16} />
            {added ? "Added to Bag!" : "Add to Bag"}
          </button>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { icon: Truck, text: "Free shipping over $100" },
              { icon: Shield, text: "Secure checkout" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2"
              >
                <Icon size={14} className="text-[#c9a96e]" />
                <span className="text-white/50 text-xs">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-display font-black text-white mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="cursor-pointer group"
              >
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-[#181717] mb-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-white text-sm font-medium truncate">{p.name}</p>
                <p className="text-[#c9a96e] text-sm font-bold">${p.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
