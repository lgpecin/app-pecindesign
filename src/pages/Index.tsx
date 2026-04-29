import { motion } from "framer-motion";
import { Play, PaintbrushVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClientConfig } from "@/hooks/useClientConfig";
import FolderCard from "@/components/FolderCard";

const Index = () => {
  const navigate = useNavigate();
  const { config } = useClientConfig();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
    >
      <header
        className="flex items-center justify-between px-8 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <span
          className="font-heading text-xs tracking-widest uppercase"
          style={{ color: config.textColor, opacity: 0.7 }}
        >
          {config.headerLeft}
        </span>
        <span className="text-xs" style={{ color: config.textColor, opacity: 0.7 }}>
          {config.headerRight}
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Logo / Ícone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center justify-center"
        >
          {config.logo ? (
            <img
              src={`/Cliente/${config.logo}`}
              alt="Logo do cliente"
              className="h-32 w-auto object-contain"
            />
          ) : (
            <div
              className="flex items-center justify-center w-24 h-24 rounded-2xl"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.10)" }}
            >
              <PaintbrushVertical
                className="w-12 h-12"
                style={{ color: config.titleColor, opacity: 0.85 }}
              />
            </div>
          )}
        </motion.div>

        {/* Texto de boas-vindas */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center max-w-lg mb-10 text-sm leading-relaxed"
          style={{ color: config.textColor }}
        >
          {config.welcomeText}
        </motion.p>

        {/* Botão Iniciar Apresentação — sempre visível */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mb-20"
        >
          {config.presentationFile ? (
            <motion.button
              onClick={() => navigate("/apresentacao")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 py-4 font-heading font-semibold rounded-xl shadow-lg transition-shadow"
              style={{
                backgroundColor: config.titleColor,
                color: config.backgroundColor,
                boxShadow: `0 8px 32px ${config.titleColor}30`,
              }}
            >
              <Play className="w-5 h-5" />
              Iniciar Apresentação
            </motion.button>
          ) : (
            <div
              className="flex items-center gap-3 px-8 py-4 font-heading font-semibold rounded-xl cursor-default select-none"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1.5px solid rgba(255,255,255,0.10)",
                color: config.textColor,
                opacity: 0.5,
              }}
            >
              <Play className="w-5 h-5" />
              Iniciar Apresentação
            </div>
          )}
        </motion.div>

        {/* Grade de pastas */}
        {config.visibleFolders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl w-full justify-items-center"
          >
            {config.visibleFolders.map((folder) => (
              <FolderCard
                key={folder}
                label={folder}
                onClick={() => navigate(`/pasta/${encodeURIComponent(folder)}`)}
              />
            ))}
          </motion.div>
        )}
      </main>

      <footer
        className="flex items-center justify-between px-8 py-4 border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <span className="text-xs" style={{ color: config.textColor, opacity: 0.5 }}>
          {config.footerText}
        </span>
        <span className="text-xs" style={{ color: config.textColor, opacity: 0.5 }}>
          © {new Date().getFullYear()} Todos os direitos reservados.
        </span>
      </footer>
    </div>
  );
};

export default Index;
