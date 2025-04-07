
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import BookshelfModel from './BookshelfModel';
import CameraSetup from './CameraSetup';
import { RotateIconHelper } from './RotateIconHelper';

// Main component
const ThreeDBookshelf: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas shadows gl={{ antialias: true }}>
        <CameraSetup />
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#202020', 5, 20]} />
        
        <ambientLight intensity={0.5} />
        <BookshelfModel />
        
        {/* Shadows beneath the model */}
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={3}
        />
        
        {/* Environment lighting */}
        <Environment preset="sunset" />
        
        {/* Controls for rotating and zooming */}
        <OrbitControls 
          enablePan={false}
          minDistance={3.5}
          maxDistance={9}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />
        
        {/* Helper icon to indicate rotation ability */}
        <RotateIconHelper />
      </Canvas>
    </div>
  );
};

export default ThreeDBookshelf;
