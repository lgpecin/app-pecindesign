import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Image, Download, ExternalLink, Palette } from "lucide-react";
import { useClientConfig } from "@/hooks/useClientConfig";
import { useFolderConfig } from "@/hooks/useFolderConfig";
import type { FolderConfigItem } from "@/hooks/useFolderConfig";

const FolderPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const folderName = slug ? decodeURIComponent(slug) : undefined;
  const { config: siteConfig } = useClientConfig();
  const { data: folder, loading, error } = useFolderConfig(folderName);

  const resolveFile = (file: string) =>
    `/Cliente/${encodeURIComponent(folderName || "")}/${file}`;

  const renderItem = (item: FolderConfigItem, i: number) => {
    const delay = 0.08 * i;

    if (item.type === "heading") {
      return (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay }}
        >
          <h2
            className="font-heading text-xl font-bold mt-6 mb-1"
            style={{ color: siteConfig.titleColor }}
          >
            {item.title}
          </h2>
          {item.content && (
            <p className="text-sm" style={{ color: siteConfig.textColor }}>
              {item.content}
            </p>
          )}
        </motion.div>
      );
    }

    if (item.type === "divider") {
      return (
        <hr
          key={i}
          className="my-6"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        />
      );
    }

    if (item.type === "image") {
      return (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay }}
          className="space-y-2"
        >
          {item.title && (
            <p className="text-sm font-medium" style={{ color: siteConfig.titleColor }}>
              {item.title}
            </p>
          )}
          {item.file && (
            <img
              src={resolveFile(item.file)}
              alt={item.title || ""}
              className="rounded-xl max-w-full w-full object-cover"
            />
          )}
        </motion.div>
      );
    }

    if (item.type === "color_palette" && item.colors) {
      return (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay }}
          className="space-y-3"
        >
          {item.title && (
            <p className="text-sm font-medium" style={{ color: siteConfig.titleColor }}>
              {item.title}
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {item.colors.map((color, ci) => (
              <div key={ci} className="space-y-2">
                <div
                  className="w-full h-20 rounded-xl shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
                <p
                  className="text-xs font-mono"
                  style={{ color: siteConfig.textColor, opacity: 0.7 }}
                >
                  {color.hex}
                </p>
                {color.name && (
                  <p className="text-xs font-medium" style={{ color: siteConfig.textColor }}>
                    {color.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      );
    }

    if (item.type === "button") {
      const href = item.file ? resolveFile(item.file) : "#";
      return (
        <motion.a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          download={!!item.file}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-semibold text-sm transition-opacity hover:opacity-90"
          style={{
            backgroundColor: siteConfig.titleColor,
            color: siteConfig.backgroundColor,
          }}
        >
          <Download className="w-4 h-4" />
          {item.label || item.title || "Download"}
        </motion.a>
      );
    }

    // Default: text
    return (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="flex items-start gap-4 p-4 rounded-xl"
        style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          <FileText className="w-5 h-5" style={{ color: siteConfig.titleColor, opacity: 0.8 }} />
        </div>
        <div>
          {item.title && (
            <p className="text-sm font-medium mb-1" style={{ color: siteConfig.titleColor }}>
              {item.title}
            </p>
          )}
          {item.content && (
            <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: siteConfig.textColor }}>
              {item.content}
            </p>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: siteConfig.backgroundColor }}
    >
      <header
        className="flex items-center gap-4 px-8 py-4 border-b sticky top-0 z-10"
        style={{
          backgroundColor: siteConfig.backgroundColor,
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 transition-opacity hover:opacity-100"
          style={{ color: siteConfig.textColor, opacity: 0.6 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-heading">Voltar</span>
        </motion.button>
      </header>

      <main className="flex-1 px-8 py-12 max-w-3xl mx-auto w-full">
        {loading && (
          <p className="text-sm" style={{ color: siteConfig.textColor, opacity: 0.5 }}>
            Carregando...
          </p>
        )}

        {error && (
          <p className="text-sm" style={{ color: "#f87171" }}>
            Erro ao carregar pasta: {error}
          </p>
        )}

        {folder && (
          <>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-3xl font-bold mb-2"
              style={{ color: siteConfig.titleColor }}
            >
              {folder.title}
            </motion.h1>

            {folder.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm mb-4"
                style={{ color: siteConfig.textColor, opacity: 0.7 }}
              >
                {folder.description}
              </motion.p>
            )}

            <div
              className="w-12 h-1 rounded-full mb-10"
              style={{ backgroundColor: siteConfig.titleColor, opacity: 0.6 }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {folder.items?.map((item, i) => renderItem(item, i))}

              {(!folder.items || folder.items.length === 0) && (
                <p className="text-sm text-center py-12" style={{ color: siteConfig.textColor, opacity: 0.4 }}>
                  Esta pasta está vazia.
                </p>
              )}
            </motion.div>
          </>
        )}
      </main>

      <footer
        className="flex items-center justify-center px-8 py-4 border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <span className="text-xs" style={{ color: siteConfig.textColor, opacity: 0.4 }}>
          {siteConfig.footerText}
        </span>
      </footer>
    </div>
  );
};

export default FolderPage;
