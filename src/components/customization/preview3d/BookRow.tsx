
import React from 'react';
import * as THREE from 'three';

interface BookRowProps {
  position: [number, number, number];
}

const BookRow: React.FC<BookRowProps> = ({ position }) => {
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

export default BookRow;
