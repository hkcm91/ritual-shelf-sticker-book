
import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

const CameraSetup: React.FC = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    // Set initial camera position
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  return null;
};

export default CameraSetup;
