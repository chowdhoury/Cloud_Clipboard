import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { RetrieveSection } from './components/RetrieveSection';
import { cleanupExpiredItems } from './utils/storage';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'retrieve'>('upload');

  useEffect(() => {
    // Clean up expired items on app load
    cleanupExpiredItems();
    
    // Set up periodic cleanup every minute
    const interval = setInterval(cleanupExpiredItems, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleUploadSuccess = (code: string) => {
    // Could show a success animation or redirect to retrieve tab
    setTimeout(() => {
      setActiveTab('retrieve');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="min-h-screen bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <Header activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main>
            {activeTab === 'upload' ? (
              <UploadSection onUploadSuccess={handleUploadSuccess} />
            ) : (
              <RetrieveSection />
            )}
          </main>
          
          <footer className="mt-16 text-center text-white/40 text-sm">
            <p>
              Files and text are automatically deleted after 24 hours. 
              This demo uses browser storage - in production, use a secure backend.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;