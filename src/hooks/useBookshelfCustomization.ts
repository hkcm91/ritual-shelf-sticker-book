
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CustomizationState } from '../components/bookshelf/CustomizationPanel';

export const useBookshelfCustomization = (activeShelfId: string) => {
  // Customization state
  const [customization, setCustomization] = useState<CustomizationState>({
    containerBgImage: '',
    containerBgColor: '#a47148',
    containerOpacity: 1,
    shelfBgImage: '',
    shelfBgColor: '#8B5A2B',
    shelfOpacity: 1,
    isCustomizationOpen: false
  });
  
  // Load customization from localStorage
  useEffect(() => {
    try {
      const savedContainerBgImage = localStorage.getItem(`bookshelf-container-bg-image-${activeShelfId}`);
      const savedContainerBgColor = localStorage.getItem(`bookshelf-container-bg-color-${activeShelfId}`);
      const savedContainerOpacity = localStorage.getItem(`bookshelf-container-opacity-${activeShelfId}`);
      const savedShelfBgImage = localStorage.getItem(`bookshelf-shelf-bg-image-${activeShelfId}`);
      const savedShelfBgColor = localStorage.getItem(`bookshelf-shelf-bg-color-${activeShelfId}`);
      const savedShelfOpacity = localStorage.getItem(`bookshelf-shelf-opacity-${activeShelfId}`);
      
      setCustomization(prev => ({
        ...prev,
        containerBgImage: savedContainerBgImage || '',
        containerBgColor: savedContainerBgColor || '#a47148',
        containerOpacity: savedContainerOpacity ? parseFloat(savedContainerOpacity) : 1,
        shelfBgImage: savedShelfBgImage || '',
        shelfBgColor: savedShelfBgColor || '#8B5A2B',
        shelfOpacity: savedShelfOpacity ? parseFloat(savedShelfOpacity) : 1
      }));
    } catch (error) {
      console.error('Error loading customization:', error);
    }
  }, [activeShelfId]);
  
  // Save customization to localStorage
  const saveCustomization = () => {
    try {
      // Container customization
      if (customization.containerBgImage) {
        try {
          localStorage.setItem(`bookshelf-container-bg-image-${activeShelfId}`, customization.containerBgImage);
        } catch (e) {
          console.error('Failed to save container background image:', e);
          toast.error('Background image too large to save. Try using a URL instead.');
        }
      }
      
      localStorage.setItem(`bookshelf-container-bg-color-${activeShelfId}`, customization.containerBgColor);
      localStorage.setItem(`bookshelf-container-opacity-${activeShelfId}`, customization.containerOpacity.toString());
      
      // Shelf customization
      if (customization.shelfBgImage) {
        try {
          localStorage.setItem(`bookshelf-shelf-bg-image-${activeShelfId}`, customization.shelfBgImage);
        } catch (e) {
          console.error('Failed to save shelf background image:', e);
          toast.error('Shelf texture image too large to save. Try using a URL instead.');
        }
      }
      
      localStorage.setItem(`bookshelf-shelf-bg-color-${activeShelfId}`, customization.shelfBgColor);
      localStorage.setItem(`bookshelf-shelf-opacity-${activeShelfId}`, customization.shelfOpacity.toString());
      
      toast.success('Customization saved');
    } catch (error) {
      console.error('Error saving customization:', error);
      toast.error('Failed to save customization');
    }
  };
  
  // Reset customization
  const resetCustomization = () => {
    setCustomization({
      containerBgImage: '',
      containerBgColor: '#a47148',
      containerOpacity: 1,
      shelfBgImage: '',
      shelfBgColor: '#8B5A2B',
      shelfOpacity: 1,
      isCustomizationOpen: true
    });
    
    // Remove from localStorage
    localStorage.removeItem(`bookshelf-container-bg-image-${activeShelfId}`);
    localStorage.removeItem(`bookshelf-container-bg-color-${activeShelfId}`);
    localStorage.removeItem(`bookshelf-container-opacity-${activeShelfId}`);
    localStorage.removeItem(`bookshelf-shelf-bg-image-${activeShelfId}`);
    localStorage.removeItem(`bookshelf-shelf-bg-color-${activeShelfId}`);
    localStorage.removeItem(`bookshelf-shelf-opacity-${activeShelfId}`);
    
    toast.success('Customization reset to defaults');
  };
  
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'container' | 'shelf'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          try {
            const result = event.target.result;
            if (target === 'container') {
              setCustomization(prev => ({...prev, containerBgImage: result}));
            } else {
              setCustomization(prev => ({...prev, shelfBgImage: result}));
            }
            saveCustomization();
          } catch (error) {
            console.error('Error handling image:', error);
            toast.error('Image may be too large. Try using a URL instead.');
          }
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Only image files are supported');
    }
    
    // Reset the input
    e.target.value = '';
  };
  
  const handleImageUrl = (url: string, target: 'container' | 'shelf') => {
    if (!url) return;
    
    try {
      if (target === 'container') {
        setCustomization(prev => ({...prev, containerBgImage: url}));
      } else {
        setCustomization(prev => ({...prev, shelfBgImage: url}));
      }
      saveCustomization();
    } catch (error) {
      console.error('Error setting image URL:', error);
      toast.error('Failed to set image URL');
    }
  };
  
  return {
    customization,
    setCustomization,
    saveCustomization,
    resetCustomization,
    handleFileChange,
    handleImageUrl
  };
};
