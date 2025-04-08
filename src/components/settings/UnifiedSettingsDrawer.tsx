
import React, { useState } from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Layout, 
  Palette,
  Save,
  BookMarked,
  Settings2
} from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SettingsDrawerContent from './SettingsDrawerContent';
import LibrarySettingsTab from './tabs/LibrarySettingsTab';
import AppearanceTab from './AppearanceTab';

interface UnifiedSettingsDrawerProps {
  onLibrarySettingsOpen?: () => void;
}

const UnifiedSettingsDrawer: React.FC<UnifiedSettingsDrawerProps> = ({ 
  onLibrarySettingsOpen 
}) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { libraryId } = useParams<{ libraryId: string }>();
  const { shelves } = useBookshelfStore();
  
  const isLibraryPage = location.pathname.startsWith('/library/');
  const currentLibrary = libraryId && shelves ? shelves[libraryId] : null;
  
  // Default to most appropriate tab based on current page
  const defaultTab = isLibraryPage ? 'library' : 'appearance';
  
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    
    // If we're opening the drawer and we're on a library page, inform parent
    if (newOpen && isLibraryPage && onLibrarySettingsOpen) {
      onLibrarySettingsOpen();
    }
  };

  const handleTriggerClick = () => {
    setOpen(true);
  };
  
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-amber-800/70 hover:bg-amber-700/80 text-amber-100"
                onClick={handleTriggerClick}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1A1F2C] border border-amber-600/20 text-amber-100">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SheetTrigger>
      
      <SheetContent className="overflow-y-auto bg-[#1A1F2C] border-l border-amber-700/30 text-amber-100 w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-amber-200">Settings</SheetTitle>
          <SheetDescription className="text-amber-100/70">
            Customize your bookshelf experience
          </SheetDescription>
        </SheetHeader>
        
        {isLibraryPage ? (
          <Tabs defaultValue={defaultTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-2 bg-amber-950/50 border border-amber-700/30">
              <TabsTrigger 
                value="library" 
                className="flex items-center gap-1 data-[state=active]:bg-amber-900/50 data-[state=active]:text-amber-100"
              >
                <BookMarked className="h-3.5 w-3.5" />
                <span>Library Settings</span>
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="flex items-center gap-1 data-[state=active]:bg-amber-900/50 data-[state=active]:text-amber-100"
              >
                <Palette className="h-3.5 w-3.5" />
                <span>Theme</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="library" className="mt-4 space-y-6">
              <LibrarySettingsTab 
                currentLibrary={currentLibrary} 
                libraryId={libraryId || ''}
                onCloseDrawer={() => setOpen(false)}
              />
            </TabsContent>
            
            <TabsContent value="appearance" className="mt-4 space-y-6">
              <AppearanceTab onCloseDrawer={() => setOpen(false)} />
            </TabsContent>
          </Tabs>
        ) : (
          <SettingsDrawerContent onCloseDrawer={() => setOpen(false)} />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default UnifiedSettingsDrawer;
