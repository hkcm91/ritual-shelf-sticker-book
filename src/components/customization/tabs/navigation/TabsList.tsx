
import React from 'react';
import { TabsList as UITabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Palette, 
  AppWindow,
  SquareDashedBottomCode,
  SquareStack,
  Layers,
  Image,
  Brush
} from "lucide-react";

const TabsList: React.FC = () => {
  return (
    <UITabsList className="w-full justify-start mb-4 overflow-x-auto">
      <TabsTrigger value="themes" className="flex items-center">
        <Brush className="mr-1 h-4 w-4" /> Themes
      </TabsTrigger>
      <TabsTrigger value="general" className="flex items-center">
        <AppWindow className="mr-1 h-4 w-4" /> General
      </TabsTrigger>
      <TabsTrigger value="container" className="flex items-center">
        <SquareDashedBottomCode className="mr-1 h-4 w-4" /> Container
      </TabsTrigger>
      <TabsTrigger value="shelves" className="flex items-center">
        <SquareStack className="mr-1 h-4 w-4" /> Shelves
      </TabsTrigger>
      <TabsTrigger value="slots" className="flex items-center">
        <Layers className="mr-1 h-4 w-4" /> Slots
      </TabsTrigger>
      <TabsTrigger value="header" className="flex items-center">
        <Image className="mr-1 h-4 w-4" /> Header
      </TabsTrigger>
    </UITabsList>
  );
};

export default TabsList;
