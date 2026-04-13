import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Image, Download, ExternalLink, Palette } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, typeof FileText> = {
  text: FileText,
  heading: FileText,
  image: Image,
  color_palette: Palette,
  button: ExternalLink,
  divider: FileText,
};

const FolderPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: folder } = useQuery({
    queryKey: ["folder", slug],
    queryFn: async () => {
      const { data } = await supabase.from("folders").select("*").eq("id", slug!).single();
      return data;
    },
    enabled: !!slug,
  });

  const { data: items } = useQuery({
    queryKey: ["folder_items", slug],
    queryFn: async () => {
      const { data } = await supabase.from("folder_items").select("*").eq("folder_id", slug!).order("sort_order");
      return data || [];
    },
    enabled: !!slug,
  });

  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").limit(1).single();
      return data;
    },
  });

  const parseColors = (content: string) => {
    return content.split("\n").filter(Boolean).map(line => {
      const parts = line.trim().split(/\s+/);
      const hex = parts[0];
      const name = parts.slice(1).join(" ");
      return { hex, name };
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center gap-4 px-8 py-4 border-b border-border/50">
        <motion.button onClick={() => navigate("/")} whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-heading">Voltar</span>
        </motion.button>
      </header>

      <main className="flex-1 px-8 py-12 max-w-3xl mx-auto w-full">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-3xl font-bold mb-2">
          {folder?.label || "..."}
        </motion.h1>
        <div className="w-12 h-1 bg-primary rounded-full mb-10" />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-6">
          {items?.map((item, i) => {
            const Icon = iconMap[item.item_type] || FileText;

            if (item.item_type === "heading") {
              return (
                <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i }}>
                  <h2 className="font-heading text-xl font-bold mt-6 mb-1">{item.title}</h2>
                  {item.content && <p className="text-muted-foreground text-sm">{item.content}</p>}
                </motion.div>
              );
            }

            if (item.item_type === "image") {
              return (
                <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i }} className="space-y-2">
                  {item.title && <p className="text-sm font-medium">{item.title}</p>}
                  {item.image_url && <img src={item.image_url} alt={item.title || ""} className="rounded-xl max-w-full" />}
                </motion.div>
              );
            }

            if (item.item_type === "color_palette" && item.content) {
              const colors = parseColors(item.content);
              return (
                <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i }} className="space-y-3">
                  {item.title && <p className="text-sm font-medium">{item.title}</p>}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {colors.map((color, ci) => (
                      <div key={ci} className="space-y-1">
                        <div className="w-full h-20 rounded-lg" style={{ backgroundColor: color.hex }} />
                        <p className="text-xs font-mono text-muted-foreground">{color.hex}</p>
                        {color.name && <p className="text-xs">{color.name}</p>}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            }

            if (item.item_type === "button") {
              return (
                <motion.a key={item.id} href={item.image_url || "#"} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-heading font-semibold text-sm hover:opacity-90 transition-opacity">
                  <Download className="w-4 h-4" />
                  {item.content || item.title || "Download"}
                </motion.a>
              );
            }

            if (item.item_type === "divider") {
              return <hr key={item.id} className="border-border my-6" />;
            }

            // Default: text
            return (
              <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                className="flex items-start gap-4 p-4 rounded-xl bg-card hover:bg-secondary/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  {item.title && <p className="text-sm font-medium mb-1">{item.title}</p>}
                  {item.content && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.content}</p>}
                </div>
              </motion.div>
            );
          })}

          {items?.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-12">Esta pasta está vazia.</p>
          )}
        </motion.div>
      </main>

      <footer className="flex items-center justify-center px-8 py-4 border-t border-border/50">
        <span className="text-xs text-muted-foreground">
          {settings?.footer_text || "Pecin Design · Entrega de Projeto"}
        </span>
      </footer>
    </div>
  );
};

export default FolderPage;
