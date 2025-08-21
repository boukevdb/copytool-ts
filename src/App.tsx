import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { CopyPage } from './components/copy/CopyPage';
import { BrandManagementPage } from './components/settings/BrandManagementPage';
import { Button } from './components/ui/button';
import { FileText, Settings } from 'lucide-react';
import './index.css';

const queryClient = new QueryClient();

function App() {
  const [currentPage, setCurrentPage] = useState<'content' | 'brands'>('content');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">TOV Content Generator</h1>
              <div className="flex gap-2">
                <Button
                  variant={currentPage === 'content' ? 'default' : 'outline'}
                  onClick={() => setCurrentPage('content')}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Content Generator
                </Button>
                <Button
                  variant={currentPage === 'brands' ? 'default' : 'outline'}
                  onClick={() => setCurrentPage('brands')}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Brand Management
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        {currentPage === 'content' ? <CopyPage /> : <BrandManagementPage />}
        
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
