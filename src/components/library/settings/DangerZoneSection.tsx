
import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ShelfData } from '@/store/types';

interface DangerZoneSectionProps {
  currentLibrary: ShelfData | null;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  onDeleteLibrary: () => void;
}

const DangerZoneSection: React.FC<DangerZoneSectionProps> = ({
  currentLibrary,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  onDeleteLibrary
}) => {
  return (
    <div className="popup-section bg-red-950/20 p-5 rounded-lg border border-red-800/30">
      <h3 className="popup-section-title text-lg font-semibold mb-3 flex items-center gap-2 text-red-300">
        <span className="h-2 w-2 rounded-full bg-red-500 inline-block"></span>
        Danger Zone
      </h3>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full border-red-800/30 bg-red-950/30 text-red-300 hover:bg-red-900/40 hover:text-red-200"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete this library
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#1A1F2C] border border-amber-700/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-300 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Delete Library
            </AlertDialogTitle>
            <AlertDialogDescription className="text-amber-100">
              Are you sure you want to delete <span className="font-bold">"{currentLibrary?.name}"</span>?
              <p className="text-red-300 mt-2">
                This action cannot be undone and all items in this library will be permanently removed.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-amber-700/30 text-amber-200 hover:bg-amber-950/30">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-gradient-to-b from-red-500 to-red-700 text-white hover:from-red-400 hover:to-red-600"
              onClick={onDeleteLibrary}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DangerZoneSection;
