
import React from 'react';
import Header from '../components/layout/Header';

const WidgetLauncher: React.FC = () => {
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: 'var(--page-bg, #f5f5f5)',
        backgroundImage: 'var(--page-bg-image, none)',
        backgroundSize: 'var(--page-bg-size, cover)',
        backgroundRepeat: 'var(--page-bg-repeat, no-repeat)',
        backgroundPosition: 'var(--page-bg-position, center)',
        backgroundAttachment: 'var(--page-bg-attachment, fixed)',
        color: 'var(--page-text-color, #333333)'
      }}
    >
      <Header />
      
      <div className="flex-grow w-full overflow-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Widget Launcher Sticker Book</h1>
        <p className="text-lg mb-4">
          This page will contain a launcher for different types of widget sticker books.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="p-6 rounded-lg bg-amber-50 border border-amber-200 shadow-md">
            <h2 className="text-xl font-semibold mb-2">Book Library</h2>
            <p>Keep track of your books and reading progress</p>
          </div>
          
          <div className="p-6 rounded-lg bg-emerald-50 border border-emerald-200 shadow-md">
            <h2 className="text-xl font-semibold mb-2">Notebook Library</h2>
            <p>Store and organize your notes and journals</p>
          </div>
          
          <div className="p-6 rounded-lg bg-rose-50 border border-rose-200 shadow-md">
            <h2 className="text-xl font-semibold mb-2">Recipe Library</h2>
            <p>Collect recipes from online and family traditions</p>
          </div>
          
          <div className="p-6 rounded-lg bg-purple-50 border border-purple-200 shadow-md">
            <h2 className="text-xl font-semibold mb-2">Music Library</h2>
            <p>Track your favorite songs and playlists</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetLauncher;
