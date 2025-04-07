
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useHelper, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { RotateIconHelper } from './RotateIconHelper';

// Bookshelf model component
const BookshelfModel: React.FC = () => {
  const { shelfStyling, container } = useBookshelfStore();
  const group = useRef<THREE.Group>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  
  // For debugging lights (uncomment when needed)
  // useHelper(spotLightRef, THREE.SpotLightHelper, 'red');
  // useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'blue');
  
  // Convert CSS color to Three.js color
  const getShelfColor = () => {
    return new THREE.Color(shelfStyling?.color || '#8B5A2B');
  };
  
  const getContainerColor = () => {
    return new THREE.Color(container?.background || '#d8bd93');
  };
  
  useFrame((state, delta) => {
    if (!group.current) return;
    
    // Subtle automatic rotation if not being controlled
    // Check if mouse buttons are pressed (using any property to avoid TypeScript error)
    const isControlActive = (state as any).mouse.buttons > 0;
    if (!isControlActive) {
      group.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={group} position={[0, -1, 0]} scale={[0.9, 0.9, 0.9]}>
      {/* Container (back panel) */}
      <mesh position={[0, 0, -0.6]} receiveShadow>
        <boxGeometry args={[5, 3, 0.1]} />
        <meshStandardMaterial 
          color={getContainerColor()} 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Bottom shelf */}
      <mesh position={[0, -1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 0.2, 1.2]} />
        <meshStandardMaterial 
          color={getShelfColor()} 
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Middle shelf */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 0.2, 1.2]} />
        <meshStandardMaterial 
          color={getShelfColor()} 
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Top shelf */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 0.2, 1.2]} />
        <meshStandardMaterial 
          color={getShelfColor()} 
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Left side panel */}
      <mesh position={[-2.45, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 2.6, 1.2]} />
        <meshStandardMaterial 
          color={getShelfColor()} 
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Right side panel */}
      <mesh position={[2.45, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 2.6, 1.2]} />
        <meshStandardMaterial 
          color={getShelfColor()} 
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Add books (as simple placeholders) */}
      <BookRow position={[0, -0.6, 0]} />
      <BookRow position={[0, 0.6, 0]} />
      
      {/* Lights */}
      <spotLight
        ref={spotLightRef}
        position={[3, 3, 5]}
        angle={0.5}
        penumbra={0.5}
        intensity={10}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      <directionalLight 
        ref={directionalLightRef}
        position={[-5, 3, 5]} 
        intensity={2}
        castShadow
      />
    </group>
  );
};

// Book row component to render a row of books
const BookRow: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const bookColors = [
    '#8B4513', // SaddleBrown
    '#A52A2A', // Brown
    '#800000', // Maroon
    '#556B2F', // DarkOliveGreen
    '#2F4F4F', // DarkSlateGray
    '#191970', // MidnightBlue
    '#4B0082', // Indigo
  ];
  
  return (
    <group position={position}>
      {/* Create 7 books with different colors */}
      {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((xPos, index) => (
        <mesh key={index} position={[xPos, 0, 0.2]} castShadow>
          <boxGeometry args={[0.4, 0.8 - Math.random() * 0.2, 0.6]} />
          <meshStandardMaterial 
            color={bookColors[index % bookColors.length]} 
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

// Camera setup component
const CameraSetup: React.FC = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    // Set initial camera position
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  return null;
};

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
