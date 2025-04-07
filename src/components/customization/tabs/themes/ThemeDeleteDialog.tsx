
import React from 'react';
import { ThemeName } from '@/themes';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ThemeDeleteDialogProps {
  themeToDelete: ThemeName | null;
  onClose: () => void;
  onConfirm: () => void;
  isActiveTheme: boolean;
}

const ThemeDeleteDialog: React.FC<ThemeDeleteDialogProps> = ({
  themeToDelete,
  onClose,
  onConfirm,
  isActiveTheme
}) => {
  return (
    <AlertDialog 
      open={!!themeToDelete} 
      onOpenChange={(open) => !open && onClose()}
    >
      <AlertDialogContent className="border-amber-200/50 bg-gradient-to-b from-slate-900/90 to-slate-800/90 text-slate-100">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-amber-100">Delete Magical Theme</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-300">
            Are you sure you want to delete this enchanted theme? This spell cannot be undone.
            {isActiveTheme && (
              <p className="mt-2 font-semibold text-red-400">
                This is your current active theme. Deleting it will switch you to the default theme.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-500/80 text-white hover:bg-red-600/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ThemeDeleteDialog;
