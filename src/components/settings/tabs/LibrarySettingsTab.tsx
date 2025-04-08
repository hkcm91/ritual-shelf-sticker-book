
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ShelfData } from '@/store/types';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  LibraryNameSection, 
  DisplayOptionsSection,
  DangerZoneSection,
  SaveLibraryButton
} from '@/components/library';
import { getThemeColors } from '@/components/library/settings/ThemedUtils';

interface LibrarySettingsTabProps {
  currentLibrary: ShelfData | null;
  libraryId: string;
  onCloseDrawer: () => void;
}

const LibrarySettingsTab: React.FC<LibrarySettingsTabProps> = ({
  currentLibrary,
  libraryId,
  onCloseDrawer
}) => {
  const { updateShelf, deleteShelf } = useBookshelfStore();
  const navigate = useNavigate();
  const [libraryName, setLibraryName] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    if (currentLibrary) {
      setLibraryName(currentLibrary.name);
    }
  }, [currentLibrary]);
  
  const handleUpdateSettings = () => {
    if (libraryId && libraryName.trim()) {
      updateShelf(libraryId, { name: libraryName });
      toast.success('Library settings updated');
    } else {
      toast.error('Library name cannot be empty');
    }
  };
  
  const handleDeleteLibrary = () => {
    if (libraryId) {
      deleteShelf(libraryId);
      setIsDeleteDialogOpen(false);
      onCloseDrawer();
      navigate('/widgets');
      toast.success('Library deleted successfully');
    }
  };
  
  const handleRowsChange = (rows: number) => {
    if (libraryId) {
      updateShelf(libraryId, { rows });
    }
  };
  
  const handleColumnsChange = (columns: number) => {
    if (libraryId) {
      updateShelf(libraryId, { columns });
    }
  };

  const themeColors = getThemeColors(currentLibrary);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <LibraryNameSection 
            libraryName={libraryName}
            setLibraryName={setLibraryName}
            getThemeColors={() => themeColors}
          />
          
          <SaveLibraryButton 
            currentLibrary={currentLibrary}
            onClick={handleUpdateSettings}
          />
          
          <DisplayOptionsSection 
            currentLibrary={currentLibrary}
            onRowsChange={handleRowsChange}
            onColumnsChange={handleColumnsChange}
            getThemeColors={() => themeColors}
          />
          
          <DangerZoneSection
            currentLibrary={currentLibrary}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            onDeleteLibrary={handleDeleteLibrary}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LibrarySettingsTab;
