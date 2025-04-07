
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useBookshelfStore } from '@/store/bookshelfStore';
import BookRow from './BookRow';

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
    // Check if mouse buttons are pressed
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

export default BookshelfModel;
