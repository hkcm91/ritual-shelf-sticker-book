
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

interface RefreshThemeButtonProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

const RefreshThemeButton: React.FC<RefreshThemeButtonProps> = ({ isRefreshing, onRefresh }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="text-amber-500 hover:text-amber-400 hover:bg-amber-950/20 relative overflow-hidden group"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        {/* Background glow effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/20 to-amber-400/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
        
        <motion.div
          animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
          className="relative z-10"
        >
          <RefreshCcw size={16} className={isRefreshing ? "text-amber-400" : ""} />
        </motion.div>
        <span className="ml-1.5 relative z-10">{isRefreshing ? "Refreshing..." : "Refresh Themes"}</span>
      </Button>
    </motion.div>
  );
};

export default RefreshThemeButton;
