import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "../Context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Please enter a valid email";
    if (!form.password || form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setServerError("");
    try {
      const result = await login(form.email, form.password);
      if (result.success) {
        navigate("/");
      } else {
        setServerError(result.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
    setServerError("");
  };

  return (
    <div className="min-h-screen bg-[#0f0e0e] flex">
      {/* Left Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
          alt="Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0f0e0e]" />
        <div className="absolute bottom-12 left-12">
          <h2 className="text-white text-4xl font-display font-black leading-tight mb-2">
            Welcome<br />Back.
          </h2>
          <p className="text-white/50">Your style awaits.</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="block mb-10">
            <span className="text-2xl font-display font-black text-white">
              VOGUE<span className="text-[#c9a96e]">X</span>
            </span>
          </Link>

          <h1 className="text-3xl font-display font-black text-white mb-2">Sign In</h1>
          <p className="text-white/40 text-sm mb-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#c9a96e] hover:underline">
              Create one
            </Link>
          </p>

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded mb-6">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full bg-[#1e1d1d] border ${
                    errors.email ? "border-red-500" : "border-white/10"
                  } rounded pl-10 pr-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c9a96e]/50 transition-colors`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-[#1e1d1d] border ${
                    errors.password ? "border-red-500" : "border-white/10"
                  } rounded pl-10 pr-10 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c9a96e]/50 transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#c9a96e] text-black font-semibold uppercase tracking-wider text-sm rounded hover:bg-[#d4b87d] transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-white/20 text-xs text-center mt-8">
            Enter your email and password (min 6 characters)
          </p>
        </div>
      </div>
    </div>
  );
}
