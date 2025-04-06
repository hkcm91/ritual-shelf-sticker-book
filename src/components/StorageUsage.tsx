
import React, { useState, useEffect } from 'react';
import { getStorageStats } from '../store/utils/shelfUtils';
import { Progress } from "@/components/ui/progress";

const StorageUsage: React.FC = () => {
  const [usage, setUsage] = useState({ percent: 0, used: 0, total: 0 });
  
  useEffect(() => {
    // Get initial stats
    updateStats();
    
    // Update stats every 30 seconds or when window regains focus
    const interval = setInterval(updateStats, 30000);
    window.addEventListener('focus', updateStats);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', updateStats);
    };
  }, []);
  
  const updateStats = () => {
    const stats = getStorageStats();
    setUsage(stats);
  };
  
  // Format bytes to human-readable format
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <div className="p-2 text-xs text-gray-500">
      <div className="flex justify-between mb-1">
        <span>Storage</span>
        <span>
          {formatSize(usage.used)} / {formatSize(usage.total)}
        </span>
      </div>
      <Progress value={usage.percent} className="h-1" />
    </div>
  );
};

export default StorageUsage;
