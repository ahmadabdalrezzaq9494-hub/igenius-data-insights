import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Brain, ArrowRight, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://rakantrad.eu/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: formData.userId,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        login(data.user); // Use auth context login
        navigate("/"); // Redirect to dashboard
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Brain className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t.login?.title || "Welcome Back"}
            </h1>
            <p className="text-muted-foreground">
              {t.login?.subtitle || "Sign in to your iGenius account"}
            </p>
          </div>

          {/* Login Card */}
          <Card className="shadow-elegant">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {t.login?.signIn || "Sign In"}
              </CardTitle>
              <CardDescription>
                {t.login?.enterCredentials ||
                  "Enter your credentials to access your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="userId"
                    className="text-sm font-medium text-foreground"
                  >
                    {t.login?.userId || "User ID / Phone Number"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="userId"
                      name="userId"
                      type="text"
                      placeholder={
                        t.login?.userIdPlaceholder ||
                        "Enter your Telegram ID or phone number"
                      }
                      value={formData.userId}
                      onChange={handleChange}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    {t.login?.password || "Password"}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={
                        t.login?.passwordPlaceholder || "Enter your password"
                      }
                      value={formData.password} // Now using formData.password
                      onChange={handleChange} // Now using handleChange
                      required
                      className="pl-10 pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {/* Add this after the password field */}
                {error && (
                  <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Input type="checkbox" id="remember" className="h-4 w-4" />
                    <label
                      htmlFor="remember"
                      className="text-sm text-muted-foreground"
                    >
                      {t.login?.rememberMe || "Remember me"}
                    </label>
                  </div>
                  <NavLink
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    {t.login?.forgotPassword || "Forgot password?"}
                  </NavLink>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : t.login?.signIn || "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {/* Demo Account Hint */}
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    {t.login?.demoHint ||
                      "Use your Telegram User ID or Phone Number and password from the bot"}
                  </p>
                </div>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {t.login?.noAccount || "Don't have an account?"}{" "}
                  <NavLink
                    to="/signup"
                    className="text-primary font-semibold hover:underline"
                  >
                    {t.login?.signUp || "Sign up"}
                  </NavLink>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Options */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t.login?.contactSales || "Need help? "}
              <NavLink
                to="/contact"
                className="text-primary font-semibold hover:underline"
              >
                {t.login?.contactUs || "Contact sales"}
              </NavLink>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
