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
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Folder Icon */}
      <div className="relative w-20 h-16">
        {/* Folder back */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-12 rounded-lg bg-primary"
          style={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
        />
        {/* Folder tab */}
        <motion.div
          className="absolute top-2 left-0 w-8 h-4 rounded-t-md bg-primary"
          style={{ opacity: 0.85 }}
        />
        {/* Folder front/lid */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-12 rounded-lg origin-bottom"
          style={{ 
            backgroundColor: "hsl(45, 95%, 60%)",
            borderTopLeftRadius: 4, 
            borderTopRightRadius: 4,
          }}
          animate={{
            rotateX: isHovered ? -25 : 0,
            y: isHovered ? -2 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
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
