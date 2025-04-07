
import React from 'react';
import LinkDividerControl from './controls/LinkDividerControl';
import OrientationControls from './controls/OrientationControls';
import BooksPerSectionControls from './controls/BooksPerSectionControls';
import DividerAppearanceSliders from './controls/DividerAppearanceSliders';

interface DividerControlsProps {
  linkDividerStyling: boolean;
  setLinkDividerStyling: (value: boolean) => void;
}

const DividerControls: React.FC<DividerControlsProps> = ({ 
  linkDividerStyling, 
  setLinkDividerStyling 
}) => {
  return (
    <>
      <LinkDividerControl 
        linkDividerStyling={linkDividerStyling}
        setLinkDividerStyling={setLinkDividerStyling}
      />
      
      <OrientationControls />
      
      <BooksPerSectionControls />
      
      <DividerAppearanceSliders />
    </>
  );
};

export default DividerControls;
