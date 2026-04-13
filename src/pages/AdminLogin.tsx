import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) navigate("/admin/dashboard");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin/dashboard");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Login falhou: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <h1 className="font-heading text-2xl font-bold text-center mb-2">Admin</h1>
        <p className="text-muted-foreground text-center text-sm mb-8">Faça login para gerenciar o conteúdo</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-primary-foreground font-heading font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
