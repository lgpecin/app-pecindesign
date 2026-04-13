import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Image, Download } from "lucide-react";

const mockFiles: Record<string, { name: string; type: "pdf" | "image" | "file" }[]> = {
  logotipo: [
    { name: "Logo Principal.png", type: "image" },
    { name: "Logo Branco.png", type: "image" },
    { name: "Logo Monocromático.png", type: "image" },
    { name: "Manual de Uso.pdf", type: "pdf" },
  ],
  paleta: [
    { name: "Paleta de Cores.pdf", type: "pdf" },
    { name: "Swatches.ase", type: "file" },
  ],
  tipografia: [
    { name: "Guia Tipográfico.pdf", type: "pdf" },
    { name: "Fontes.zip", type: "file" },
  ],
  "redes-sociais": [
    { name: "Templates Instagram.zip", type: "file" },
    { name: "Capa Facebook.png", type: "image" },
    { name: "Avatar.png", type: "image" },
  ],
  papelaria: [
    { name: "Cartão de Visita.pdf", type: "pdf" },
    { name: "Envelope.pdf", type: "pdf" },
    { name: "Timbrado.pdf", type: "pdf" },
  ],
  downloads: [
    { name: "Pacote Completo.zip", type: "file" },
    { name: "Arquivos Editáveis.zip", type: "file" },
  ],
};

const folderLabels: Record<string, string> = {
  logotipo: "Logotipo",
  paleta: "Paleta de Cores",
  tipografia: "Tipografia",
  "redes-sociais": "Redes Sociais",
  papelaria: "Papelaria",
  downloads: "Downloads",
};

const iconMap = {
  pdf: FileText,
  image: Image,
  file: Download,
};

const FolderPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const files = mockFiles[slug || ""] || [];
  const label = folderLabels[slug || ""] || "Pasta";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 px-8 py-4 border-b border-border/50">
        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-heading">Voltar</span>
        </motion.button>
      </header>

      <main className="flex-1 px-8 py-12 max-w-3xl mx-auto w-full">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl font-bold mb-2"
        >
          {label}
        </motion.h1>
        <div className="w-12 h-1 bg-primary rounded-full mb-10" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          {files.map((file, i) => {
            const Icon = iconMap[file.type];
            return (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-secondary/50 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="flex-1 text-sm font-medium">{file.name}</span>
                <Download className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      <footer className="flex items-center justify-center px-8 py-4 border-t border-border/50">
        <span className="text-xs text-muted-foreground">
          Pecin Design · Entrega de Projeto
        </span>
      </footer>
    </div>
  );
};

export default FolderPage;
