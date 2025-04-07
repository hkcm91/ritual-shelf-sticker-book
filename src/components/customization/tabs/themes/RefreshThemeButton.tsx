
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
        className="text-amber-500 hover:text-amber-400 hover:bg-amber-950/20"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <motion.div
          animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
        >
          <RefreshCcw size={16} className={isRefreshing ? "text-amber-400" : ""} />
        </motion.div>
        <span className="ml-1">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
      </Button>
    </motion.div>
  );
};

export default RefreshThemeButton;
