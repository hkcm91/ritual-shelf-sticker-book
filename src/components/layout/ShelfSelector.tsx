
import React, { useState } from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';
import ShelfDialogs from '../shelf/ShelfDialogs';
import CollectionSelector from '../collections/CollectionSelector';
import CollectionActions from '../collections/CollectionActions';

const ShelfSelector: React.FC = () => {
  const { activeShelfId, shelves } = useBookshelfStore();
  const [isNewShelfModalOpen, setIsNewShelfModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const [renameValue, setRenameValue] = useState("");
  
  const shelvesData = shelves as Record<string, any>;
  
  // Find the current shelf from the store
  const currentShelf = activeShelfId ? shelvesData[activeShelfId] : null;
  
  const handleOpenRenameModal = () => {
    if (currentShelf) {
      setRenameValue(currentShelf.name);
      setIsRenameModalOpen(true);
    }
  };
  
  return (
    <>
      <div className="flex flex-col gap-3">
        <CollectionSelector />
        
        <CollectionActions 
          onCreateNew={() => setIsNewShelfModalOpen(true)}
          onRename={handleOpenRenameModal}
          className="mt-1"
        />
      </div>
      
      <ShelfDialogs 
        isNewShelfModalOpen={isNewShelfModalOpen}
        setIsNewShelfModalOpen={setIsNewShelfModalOpen}
        newShelfName={newShelfName}
        setNewShelfName={setNewShelfName}
        isRenameModalOpen={isRenameModalOpen}
        setIsRenameModalOpen={setIsRenameModalOpen}
        renameValue={renameValue}
        setRenameValue={setRenameValue}
      />
    </>
  );
};

export default ShelfSelector;
