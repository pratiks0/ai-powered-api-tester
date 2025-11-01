import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import RequestBuilder from './components/RequestBuilder';
import ResponseViewer from './components/ResponseViewer';
import HistorySidebar from './components/HistorySidebar';
import CollectionsSidebar from './components/CollectionsSidebar';
import { CollectionsProvider } from './context/CollectionsContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CollectionsProvider>
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              AI-Powered API Tester
            </h1>
            
            <div className="grid grid-cols-12 gap-8">
              {/* Sidebars */}
              <div className="col-span-3 space-y-8">
                <CollectionsSidebar />
                <HistorySidebar />
              </div>
              
              {/* Main content */}
              <div className="col-span-9 space-y-8">
                <RequestBuilder />
                <ResponseViewer />
              </div>
            </div>
          </div>
        </div>
      </CollectionsProvider>
    </QueryClientProvider>
  );
}

export default App;