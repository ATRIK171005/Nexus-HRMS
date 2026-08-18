import { cn } from "@/lib/utils";
import { Hexagon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("isLoggedIn", "true");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background noise */}
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
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Join Us</p>
          </div>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">Create an account</h1>
        <p className="text-sm text-muted-foreground mb-8">Fill in your details to set up your workspace.</p>
        
        <form className="space-y-5" onSubmit={handleSignup}>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Full Name</label>
            <input 
              type="text" 
              placeholder="Jane Doe" 
              required 
              className={cn(
                "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground",
                "outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-ring/25",
                "placeholder:text-muted-foreground/50"
              )} 
            />
          </div>

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
            <label className="text-sm font-medium text-foreground">Password</label>
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
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:text-primary-strong transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
