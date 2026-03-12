import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "All", path: "/" },
  { label: "Women", path: "/category/women" },
  { label: "Men", path: "/category/men" },
  { label: "Kids", path: "/category/kids" },
  { label: "Shoes", path: "/category/shoes" },
  { label: "Accessories", path: "/category/accessories" },
  { label: "Offers", path: "/category/offers" },
];

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0f0e0e]/95 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-black tracking-tight text-white">
              VOGUE<span className="text-[#c9a96e]">X</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-medium tracking-widest uppercase transition-all duration-200 rounded-sm ${
                    isActive
                      ? "text-[#c9a96e] border-b border-[#c9a96e]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-white/60 text-sm">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1 px-3 py-1.5 border border-white/20 text-sm text-white/70 hover:text-white hover:border-white/50 transition-all rounded"
              >
                <User size={14} />
                Sign In
              </Link>
            )}

            <Link to="/cart" className="relative p-2">
              <ShoppingBag size={22} className="text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c9a96e] text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0f0e0e] border-t border-white/10 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm tracking-widest uppercase text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10">
            {user ? (
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white"
              >
                <LogOut size={14} /> Logout ({user.name})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white"
              >
                <User size={14} /> Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
