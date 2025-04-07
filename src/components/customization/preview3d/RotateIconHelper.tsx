
import React, { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const RotateIconHelper: React.FC = () => {
  const { scene, camera, gl } = useThree();
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Create a helper icon using sprite
    const createSprite = () => {
      // Create canvas for the sprite
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Draw circular background
        context.beginPath();
        context.arc(64, 64, 55, 0, 2 * Math.PI);
        context.fillStyle = 'rgba(0, 0, 0, 0.3)';
        context.fill();
        
        // Draw rotational arrows
        context.strokeStyle = 'white';
        context.lineWidth = 6;
        
        // Draw the circle
        context.beginPath();
        context.arc(64, 64, 40, 0, 1.7 * Math.PI);
        context.stroke();
        
        // Draw arrow head
        context.beginPath();
        context.moveTo(50, 30);
        context.lineTo(35, 35);
        context.lineTo(45, 50);
        context.fillStyle = 'white';
        context.fill();
        
        // Create texture and sprite
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
          map: texture,
          transparent: true,
          opacity: 0.7
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(1.5, 1.5, 1);
        sprite.position.set(2, 0, 0);
        scene.add(sprite);
        
        return sprite;
      }
    };
    
    const sprite = createSprite();
    
    // Hide the sprite after 5 seconds
    const timeout = setTimeout(() => {
      setIsVisible(false);
      if (sprite) {
        scene.remove(sprite);
      }
    }, 5000);
    
    // Add event listener to hide on user interaction
    const handleMouseDown = () => {
      setIsVisible(false);
      if (sprite) {
        scene.remove(sprite);
      }
      clearTimeout(timeout);
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
    };
    
    gl.domElement.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      clearTimeout(timeout);
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      if (sprite) {
        scene.remove(sprite);
      }
    };
  }, [scene, camera, gl]);
  
  return null;
};
