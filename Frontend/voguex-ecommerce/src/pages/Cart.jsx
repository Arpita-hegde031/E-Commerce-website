import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag size={64} className="text-white/10 mb-6" />
        <h2 className="text-2xl font-display font-bold text-white mb-2">
          Your bag is empty
        </h2>
        <p className="text-white/40 mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a96e] text-black font-semibold uppercase tracking-wider text-sm rounded hover:bg-[#d4b87d] transition-colors"
        >
          Start Shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const shipping = cartTotal >= 100 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-display font-black text-white mb-10">
        Shopping Bag
        <span className="text-white/30 text-xl ml-3">({cartItems.length} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-[#181717] border border-white/5 rounded-lg p-4 hover:border-white/10 transition-colors"
            >
              <div className="w-24 h-28 rounded overflow-hidden shrink-0 bg-[#1e1e1e]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <h3 className="text-white font-semibold text-sm leading-tight">
                    {item.name}
                  </h3>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-white/30 hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <p className="text-white/40 text-xs mt-1 capitalize">
                  {item.category}
                </p>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity */}
                  <div className="flex items-center border border-white/20 rounded">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-2 text-white/60 hover:text-white transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-3 text-white text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-2 text-white/60 hover:text-white transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-[#c9a96e] font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-white/30 text-xs">${item.price} each</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#181717] border border-white/5 rounded-lg p-6 sticky top-24">
            <h2 className="text-white font-bold text-lg mb-6 pb-4 border-b border-white/10">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Subtotal</span>
                <span className="text-white">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Shipping</span>
                <span className={shipping === 0 ? "text-green-400" : "text-white"}>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Tax (8%)</span>
                <span className="text-white">${tax.toFixed(2)}</span>
              </div>

              {shipping === 0 && (
                <p className="text-green-400 text-xs bg-green-400/10 px-3 py-2 rounded">
                  🎉 You qualify for free shipping!
                </p>
              )}
              {shipping > 0 && (
                <p className="text-white/40 text-xs">
                  Add ${(100 - cartTotal).toFixed(2)} more for free shipping
                </p>
              )}
            </div>

            <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-4 mb-6">
              <span className="text-white">Total</span>
              <span className="text-[#c9a96e]">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full py-4 bg-[#c9a96e] text-black font-semibold uppercase tracking-wider text-sm rounded hover:bg-[#d4b87d] transition-colors flex items-center justify-center gap-2"
            >
              Checkout <ArrowRight size={16} />
            </button>

            <Link
              to="/"
              className="block text-center text-white/40 text-sm mt-4 hover:text-white transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
