
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Box } from "lucide-react";
import Preview3DModal from './preview3d/Preview3DModal';

const Preview3DButton: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false);
  
  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center gap-2 bg-gradient-to-r from-amber-800/30 to-amber-700/20 hover:from-amber-700/40 hover:to-amber-600/30 text-amber-100 border-amber-700/30"
        onClick={() => setShowPreview(true)}
      >
        <Box className="h-4 w-4" />
        <span>3D Preview</span>
      </Button>
      
      <Preview3DModal
        open={showPreview}
        onOpenChange={setShowPreview}
      />
    </>
  );
};

export default Preview3DButton;
