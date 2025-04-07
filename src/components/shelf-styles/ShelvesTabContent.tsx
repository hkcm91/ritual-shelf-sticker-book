
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShelvesTabContentProps {
  textureFileRef: React.RefObject<HTMLInputElement>;
  tempShelfColor: string;
  tempShelfOpacity: number;
  setTempShelfColor: (color: string) => void;
  setTempShelfOpacity: (opacity: number) => void;
  handleTextureFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ShelvesTabContent: React.FC<ShelvesTabContentProps> = ({
  textureFileRef,
  tempShelfColor,
  tempShelfOpacity,
  setTempShelfColor,
  setTempShelfOpacity,
  handleTextureFileChange,
}) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-3 items-center gap-4">
        <Label htmlFor="shelfColor">Color</Label>
        <Input
          id="shelfColor"
          type="color"
          value={tempShelfColor}
          onChange={(e) => setTempShelfColor(e.target.value)}
          className="col-span-2 h-10"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="shelfOpacity">Opacity</Label>
          <span className="text-sm text-muted-foreground">{Math.round(tempShelfOpacity * 100)}%</span>
        </div>
        <Slider
          id="shelfOpacity"
          min={0}
          max={1}
          step={0.01}
          value={[tempShelfOpacity]}
          onValueChange={(values) => setTempShelfOpacity(values[0])}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="textureImage">Shelf Texture</Label>
        <div className="flex gap-2">
          <Input
            ref={textureFileRef}
            id="textureImage"
            type="file"
            accept="image/*"
            onChange={handleTextureFileChange}
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline"
            size="icon"
            onClick={() => textureFileRef.current?.click()}
          >
            <Image className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Texture will be tiled across shelves
        </p>
      </div>
    </div>
  );
};

export default ShelvesTabContent;
