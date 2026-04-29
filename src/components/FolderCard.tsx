import { motion } from "framer-motion";
import { useState } from "react";

interface FolderCardProps {
  label: string;
  description?: string;
  onClick?: () => void;
}

const FolderCard = ({ label, description, onClick }: FolderCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="flex flex-col items-center gap-3 p-6 rounded-xl transition-colors hover:bg-secondary/50 cursor-pointer group"
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
    >
      <div
        style={{
          width: 80,
          height: 64,
          position: "relative",
          perspective: "200px",
          perspectiveOrigin: "50% 100%",
        }}
      >
        {/* FUNDO: um único div que preenche TUDO — nunca tem gap */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "hsl(45, 90%, 44%)",
            borderRadius: 8,
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.35) 0%, transparent 65%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            style={{
              position: "absolute",
              bottom: 10,
              left: 12,
              right: 12,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 4 }}
            transition={{ duration: 0.25, delay: 0.08 }}
          >
            <div style={{ height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.25)" }} />
            <div style={{ height: 4, borderRadius: 2, width: "65%", backgroundColor: "rgba(255,255,255,0.18)" }} />
          </motion.div>
        </div>

        {/* FRENTE: um único SVG (aba + corpo = 1 path), rotaciona inteiro */}
        <motion.svg
          width="80"
          height="64"
          viewBox="0 0 80 64"
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "center bottom",
            zIndex: 2,
          }}
          animate={{ rotateX: isHovered ? -52 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <path
            d="M6,0 L30,0 Q38,0 40,10 L74,10 Q80,10 80,16 L80,58 Q80,64 74,64 L6,64 Q0,64 0,58 L0,6 Q0,0 6,0 Z"
            fill="hsl(45, 95%, 60%)"
          />
        </motion.svg>
      </div>

      <div className="text-center">
        <p className="font-heading font-semibold text-foreground text-sm">{label}</p>
        {description && (
          <p className="text-muted-foreground text-xs mt-1 max-w-[160px]">{description}</p>
        )}
      </div>
    </motion.button>
  );
};

export default FolderCard;
