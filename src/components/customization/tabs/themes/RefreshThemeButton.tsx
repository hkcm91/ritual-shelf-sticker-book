
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Palette } from "lucide-react";

interface RefreshThemeButtonProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

const RefreshThemeButton: React.FC<RefreshThemeButtonProps> = ({
  isRefreshing,
  onRefresh
}) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={(e) => {
        e.preventDefault();
        onRefresh();
      }}
      disabled={isRefreshing}
      className="text-xs"
    >
      {isRefreshing 
        ? <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        : <Palette className="h-3 w-3 mr-1" />
      }
      {isRefreshing ? "Refreshing..." : "Refresh Theme"}
    </Button>
  );
};

export default RefreshThemeButton;
