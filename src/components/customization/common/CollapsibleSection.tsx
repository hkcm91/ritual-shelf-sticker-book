
import React, { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronUp, ChevronDown, LucideIcon } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  icon?: LucideIcon;
  isCollapsed: boolean;
  onToggle: () => void;
  children: ReactNode;
  rightElement?: ReactNode;
  className?: string;
  borderBottom?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon: Icon,
  isCollapsed,
  onToggle,
  children,
  rightElement,
  className = "",
  borderBottom = true,
}) => {
  return (
    <div className={`space-y-2 ${borderBottom ? 'border-b pb-4' : 'pt-2'} ${className}`}>
      <div className="flex justify-between items-center cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <Label className="cursor-pointer">{title}</Label>
        </div>
        <div className="flex items-center gap-2">
          {rightElement}
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="mt-2 pl-6 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
