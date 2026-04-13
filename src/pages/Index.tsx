import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FolderCard from "@/components/FolderCard";

const folders = [
  { label: "Logotipo", description: "Arquivos do logotipo e variações.", path: "/pasta/logotipo" },
  { label: "Paleta de Cores", description: "Cores da marca e códigos.", path: "/pasta/paleta" },
  { label: "Tipografia", description: "Fontes e estilos tipográficos.", path: "/pasta/tipografia" },
  { label: "Redes Sociais", description: "Templates e artes para redes.", path: "/pasta/redes-sociais" },
  { label: "Papelaria", description: "Cartão de visita, envelopes etc.", path: "/pasta/papelaria" },
  { label: "Downloads", description: "Arquivos originais e pacotes.", path: "/pasta/downloads" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-border/50">
        <span className="font-heading text-xs tracking-widest uppercase text-muted-foreground">
          pecindesign.com.br
        </span>
        <span className="text-xs text-muted-foreground">
          Entrega de Projeto
        </span>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Client Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <img
            src="/images/client-logo.png"
            alt="Logo do cliente"
            className="h-32 w-auto object-contain"
          />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-muted-foreground text-center max-w-lg mb-10 text-sm leading-relaxed"
        >
          Bem-vindo(a) ao diretório visual da marca. Explore os elementos que compõem a identidade visual do seu projeto.
        </motion.p>

        {/* Start Presentation Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-heading font-semibold rounded-xl mb-20 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
        >
          <Play className="w-5 h-5" />
          Iniciar Apresentação
        </motion.button>

        {/* Folders Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl w-full"
        >
          {folders.map((folder) => (
            <FolderCard
              key={folder.label}
              label={folder.label}
              description={folder.description}
              onClick={() => navigate(folder.path)}
            />
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between px-8 py-4 border-t border-border/50">
        <span className="text-xs text-muted-foreground">
          Pecin Design · Entrega de Projeto
        </span>
        <span className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Todos os direitos reservados.
        </span>
      </footer>
    </div>
  );
};

export default Index;
