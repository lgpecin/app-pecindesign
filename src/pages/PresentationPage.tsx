import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileWarning } from "lucide-react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useClientConfig } from "@/hooks/useClientConfig";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Worker hosted on CDN — compatible with pdfjs-dist 3.x
const PDF_WORKER_URL =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const PresentationPage = () => {
  const navigate = useNavigate();
  const { config } = useClientConfig();

  const defaultLayout = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => defaultTabs, // thumbnails + bookmarks + attachments
  });

  const pdfUrl = config.presentationFile
    ? `/Cliente/${config.presentationFile}`
    : null;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: config.backgroundColor }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-3 border-b shrink-0"
        style={{
          backgroundColor: config.backgroundColor,
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 transition-opacity hover:opacity-100"
          style={{ color: config.textColor, opacity: 0.65 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-heading">Voltar</span>
        </motion.button>

        <span
          className="font-heading text-xs tracking-widest uppercase"
          style={{ color: config.textColor, opacity: 0.45 }}
        >
          Apresentação
        </span>

        <div className="w-16" />
      </header>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-hidden">
        {pdfUrl ? (
          <Worker workerUrl={PDF_WORKER_URL}>
            <div
              style={{
                height: "calc(100vh - 53px)",
                // Override default-layout theme to match our dark palette
                "--rpv-color-primary": config.titleColor,
                "--rpv-color-primary-hover": config.titleColor,
              } as React.CSSProperties}
            >
              <Viewer
                fileUrl={pdfUrl}
                plugins={[defaultLayout]}
                theme="dark"
              />
            </div>
          </Worker>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-24">
            <FileWarning
              className="w-16 h-16 opacity-20"
              style={{ color: config.textColor }}
            />
            <p
              className="text-sm font-heading font-medium"
              style={{ color: config.textColor, opacity: 0.5 }}
            >
              Nenhum PDF configurado.
            </p>
            <p
              className="text-xs max-w-xs text-center leading-relaxed"
              style={{ color: config.textColor, opacity: 0.35 }}
            >
              Adicione o arquivo PDF na pasta{" "}
              <code className="font-mono">public/Cliente/</code> e configure o
              campo <code className="font-mono">"presentationFile"</code> no{" "}
              <code className="font-mono">config.json</code>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentationPage;
