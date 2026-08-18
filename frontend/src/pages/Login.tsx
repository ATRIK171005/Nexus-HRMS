import { cn } from "@/lib/utils";
import { Hexagon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("isLoggedIn", "true");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background noise (simulated with CSS or transparent png in real app) */}
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[url('/noise.png')] mix-blend-overlay"></div>
      
      <div className={cn(
        "w-full max-w-md bg-card border border-border rounded-3xl p-8 relative z-10",
        "transition-all duration-300 shadow-[var(--shadow-lift)]"
      )}>
        <div className="flex items-center gap-3 mb-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Hexagon size={20} strokeWidth={2} />
          </span>
          <div>
            <p className="text-lg font-bold tracking-tight text-foreground leading-tight">Nexus HRMS</p>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Workspace</p>
          </div>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-8">Enter your credentials to access your workspace.</p>
        
        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              required 
              className={cn(
                "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground",
                "outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-ring/25",
                "placeholder:text-muted-foreground/50"
              )} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:text-primary-strong transition-colors">
                Forgot password?
              </Link>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              className={cn(
                "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground",
                "outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-ring/25",
                "placeholder:text-muted-foreground/50"
              )} 
            />
          </div>

          <button 
            type="submit" 
            className={cn(
              "w-full rounded-xl py-3 text-sm font-semibold transition-all duration-200 mt-6",
              "bg-primary text-primary-foreground shadow-sm",
              "hover:shadow-md hover:brightness-110",
              "active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            )}
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            New to Nexus?{" "}
            <Link to="/signup" className="font-medium text-primary hover:text-primary-strong transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
