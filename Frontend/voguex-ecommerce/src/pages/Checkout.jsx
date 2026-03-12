import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Smartphone, Globe, CheckCircle, Lock, AlertCircle } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";

const API = "http://localhost:5000/api";

const paymentMethods = [
  { id: "card",   label: "Credit / Debit Card", icon: CreditCard },
  { id: "upi",    label: "UPI Payment",          icon: Smartphone },
  { id: "paypal", label: "PayPal",               icon: Globe },
];

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [form, setForm] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName:  user?.name?.split(" ")[1] || "",
    email:     user?.email || "",
    address:   "",
    city:      "",
    zip:       "",
    cardNumber: "",
    expiry:    "",
    cvv:       "",
    upiId:     "",
    paypalEmail: "",
  });

  const [ordered,     setOrdered]     = useState(false);
  const [orderId,     setOrderId]     = useState(null);
  const [errors,      setErrors]      = useState({});
  const [serverError, setServerError] = useState("");
  const [loading,     setLoading]     = useState(false);

  const shipping = cartTotal >= 100 ? 0 : 9.99;
  const tax      = parseFloat((cartTotal * 0.08).toFixed(2));
  const total    = parseFloat((cartTotal + shipping + tax).toFixed(2));

  const validate = () => {
    const errs = {};
    if (!form.firstName) errs.firstName = "Required";
    if (!form.lastName)  errs.lastName  = "Required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Valid email required";
    if (!form.address)   errs.address   = "Required";
    if (!form.city)      errs.city      = "Required";
    if (!form.zip)       errs.zip       = "Required";
    if (paymentMethod === "card") {
      if (!form.cardNumber || form.cardNumber.replace(/\s/g,"").length < 16)
        errs.cardNumber = "Valid 16-digit card required";
      if (!form.expiry) errs.expiry = "Required";
      if (!form.cvv || form.cvv.length < 3) errs.cvv = "Required";
    }
    if (paymentMethod === "upi"    && !form.upiId)       errs.upiId       = "UPI ID required";
    if (paymentMethod === "paypal" && !form.paypalEmail)  errs.paypalEmail  = "PayPal email required";
    return errs;
  };

  const handleSubmit = async () => {
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    // Must be logged in to save order to DB
    if (!token) {
      setServerError("Please login first to place an order.");
      return;
    }

    if (cartItems.length === 0) {
      setServerError("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Sync all local cart items to backend DB
      for (const item of cartItems) {
        const res = await fetch(`${API}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: item.id,
            quantity: item.quantity,
          }),
        });
        const data = await res.json();
        console.log("Cart sync:", item.name, data);
      }

      // Step 2: Place the order
      const orderRes = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          payment_method: paymentMethod,
          first_name:     form.firstName,
          last_name:      form.lastName,
          email:          form.email,
          address:        form.address,
          city:           form.city,
          zip:            form.zip,
        }),
      });

      const orderData = await orderRes.json();
      console.log("Order response:", orderData);

      if (orderData.success) {
        setOrderId(orderData.order_id);
        clearCart();
        setOrdered(true);
      } else {
        setServerError(orderData.message || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setServerError("Cannot connect to server. Make sure the backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
    setServerError("");
  };

  const formatCard = (val) =>
    val.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();

  // ── Order success ─────────────────────────────────────────
  if (ordered) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="bg-green-400/10 border border-green-400/30 rounded-full p-6 mb-6">
          <CheckCircle size={64} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-display font-black text-white mb-3">Order Placed!</h2>
        {orderId && (
          <p className="text-[#c9a96e] font-semibold text-lg mb-2">Order #{orderId}</p>
        )}
        <p className="text-white/50 mb-8 max-w-sm">
          Thank you! Your order is confirmed and saved to the database.
        </p>
        <button onClick={() => navigate("/")}
          className="px-8 py-4 bg-[#c9a96e] text-black font-semibold uppercase tracking-wider text-sm rounded hover:bg-[#d4b87d] transition-colors">
          Continue Shopping
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const inputClass = (field) =>
    `w-full bg-[#1e1d1d] border ${
      errors[field] ? "border-red-500" : "border-white/10"
    } rounded px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#c9a96e]/50 transition-colors`;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-display font-black text-white mb-10">Checkout</h1>

      {/* Not logged in warning */}
      {!token && (
        <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm px-4 py-3 rounded mb-6">
          <AlertCircle size={16} />
          You must be logged in to place an order.{" "}
          <a href="/login" className="underline font-semibold hover:text-yellow-300 ml-1">Login here</a>
        </div>
      )}

      {serverError && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded mb-6">
          <AlertCircle size={16} />
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left: Forms */}
        <div className="lg:col-span-3 space-y-8">

          {/* Shipping */}
          <div className="bg-[#181717] border border-white/5 rounded-lg p-6">
            <h2 className="text-white font-bold text-base mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#c9a96e] text-black text-xs flex items-center justify-center font-black">1</span>
              Shipping Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className={inputClass("firstName")} />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className={inputClass("lastName")} />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
              <div className="col-span-2">
                <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} className={inputClass("email")} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="col-span-2">
                <input name="address" placeholder="Street Address" value={form.address} onChange={handleChange} className={inputClass("address")} />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>
              <div>
                <input name="city" placeholder="City" value={form.city} onChange={handleChange} className={inputClass("city")} />
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <input name="zip" placeholder="ZIP Code" value={form.zip} onChange={handleChange} className={inputClass("zip")} />
                {errors.zip && <p className="text-red-400 text-xs mt-1">{errors.zip}</p>}
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-[#181717] border border-white/5 rounded-lg p-6">
            <h2 className="text-white font-bold text-base mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#c9a96e] text-black text-xs flex items-center justify-center font-black">2</span>
              Payment Method
            </h2>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {paymentMethods.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setPaymentMethod(id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border text-center transition-all ${
                    paymentMethod === id
                      ? "border-[#c9a96e] bg-[#c9a96e]/10 text-[#c9a96e]"
                      : "border-white/10 text-white/50 hover:border-white/30"
                  }`}>
                  <Icon size={20} />
                  <span className="text-xs font-medium leading-tight">{label}</span>
                </button>
              ))}
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <input name="cardNumber" placeholder="Card Number"
                    value={form.cardNumber}
                    onChange={(e) => setForm((f) => ({ ...f, cardNumber: formatCard(e.target.value) }))}
                    className={inputClass("cardNumber")} maxLength={19} />
                  {errors.cardNumber && <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input name="expiry" placeholder="MM / YY" value={form.expiry} onChange={handleChange} className={inputClass("expiry")} maxLength={7} />
                    {errors.expiry && <p className="text-red-400 text-xs mt-1">{errors.expiry}</p>}
                  </div>
                  <div>
                    <input name="cvv" placeholder="CVV" value={form.cvv} onChange={handleChange} className={inputClass("cvv")} maxLength={4} type="password" />
                    {errors.cvv && <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}
            {paymentMethod === "upi" && (
              <div>
                <input name="upiId" placeholder="yourname@upi" value={form.upiId} onChange={handleChange} className={inputClass("upiId")} />
                {errors.upiId && <p className="text-red-400 text-xs mt-1">{errors.upiId}</p>}
                <p className="text-white/30 text-xs mt-2">e.g. name@okaxis</p>
              </div>
            )}
            {paymentMethod === "paypal" && (
              <div>
                <input name="paypalEmail" type="email" placeholder="PayPal Email" value={form.paypalEmail} onChange={handleChange} className={inputClass("paypalEmail")} />
                {errors.paypalEmail && <p className="text-red-400 text-xs mt-1">{errors.paypalEmail}</p>}
              </div>
            )}
            <div className="flex items-center gap-2 mt-4 text-white/30 text-xs">
              <Lock size={12} /> Your payment information is encrypted and secure
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-2">
          <div className="bg-[#181717] border border-white/5 rounded-lg p-6 sticky top-24">
            <h2 className="text-white font-bold text-base mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5 max-h-48 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded" />
                    <span className="absolute -top-1.5 -right-1.5 bg-[#c9a96e] text-black text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{item.name}</p>
                    <p className="text-white/40 text-xs capitalize">{item.category}</p>
                  </div>
                  <span className="text-white text-sm font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2 mb-5">
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
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-4 mb-6">
              <span className="text-white">Total</span>
              <span className="text-[#c9a96e]">${total.toFixed(2)}</span>
            </div>
            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-4 bg-[#c9a96e] text-black font-semibold uppercase tracking-wider text-sm rounded hover:bg-[#d4b87d] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              <Lock size={14} />
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
