
import React from 'react';
import { PipetteIcon } from 'lucide-react';

// This is just a simple wrapper component to redirect to the new location
const ColorPicker = (props) => {
  console.warn('ColorPicker imported from old location, please update import to use: import ColorPicker from "src/components/customization/ColorPicker"');
  
  // Import the new component dynamically to avoid circular dependencies
  const NewColorPicker = React.lazy(() => import('./customization/ColorPicker'));
  
  return (
    <React.Suspense fallback={<div>Loading color picker...</div>}>
      <NewColorPicker {...props} />
    </React.Suspense>
  );
};

export default ColorPicker;
