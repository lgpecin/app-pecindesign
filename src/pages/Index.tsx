import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import FolderCard from "@/components/FolderCard";

const Index = () => {
  const navigate = useNavigate();

  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").limit(1).single();
      return data;
    },
  });

  const { data: folders } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const { data } = await supabase.from("folders").select("*").order("sort_order");
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-8 py-4 border-b border-border/50">
        <span className="font-heading text-xs tracking-widest uppercase text-muted-foreground">
          {settings?.header_left || "pecindesign.com.br"}
        </span>
        <span className="text-xs text-muted-foreground">
          {settings?.header_right || "Entrega de Projeto"}
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="Logo do cliente" className="h-32 w-auto object-contain" />
          ) : (
            <img src="/images/client-logo.png" alt="Logo do cliente" className="h-32 w-auto object-contain" />
          )}
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
          className="text-muted-foreground text-center max-w-lg mb-10 text-sm leading-relaxed">
          {settings?.description || "Bem-vindo(a) ao diretório visual da marca."}
        </motion.p>

        {settings?.presentation_url && (
          <motion.a
            href={settings.presentation_url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-heading font-semibold rounded-xl mb-20 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
          >
            <Play className="w-5 h-5" />
            Iniciar Apresentação
          </motion.a>
        )}

        {folders && folders.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl w-full">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                label={folder.label}
                description={folder.description || undefined}
                onClick={() => navigate(`/pasta/${folder.id}`)}
              />
            ))}
          </motion.div>
        )}
      </main>

      <footer className="flex items-center justify-between px-8 py-4 border-t border-border/50">
        <span className="text-xs text-muted-foreground">
          {settings?.footer_text || "Pecin Design · Entrega de Projeto"}
        </span>
        <span className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Todos os direitos reservados.
        </span>
      </footer>
    </div>
  );
};

export default Index;
