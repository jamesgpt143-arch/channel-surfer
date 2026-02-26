import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else onOpenChange(false);
    } else {
      if (!displayName.trim()) {
        setError("Lagyan mo ng display name");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, displayName.trim());
      if (error) setError(error.message);
      else setSuccess("Check your email to confirm your account!");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === "login" ? "Mag-login" : "Gumawa ng Account"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-sm text-muted-foreground">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full mt-1 bg-secondary text-foreground px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="Juan dela Cruz"
                required
              />
            </div>
          )}
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 bg-secondary text-foreground px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="email@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 bg-secondary text-foreground px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-primary">{success}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Loading..." : mode === "login" ? "Login" : "Sign Up"}
          </button>
          <p className="text-sm text-center text-muted-foreground">
            {mode === "login" ? "Wala ka pang account? " : "May account ka na? "}
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
              className="text-primary hover:underline"
            >
              {mode === "login" ? "Sign Up" : "Login"}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
