import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CollectionsProvider } from './context/CollectionsContext';
import { RequestProvider } from './context/RequestContext';
import Layout from './components/Layout';
import RequestBuilder from './components/RequestBuilder';
import ResponseViewer from './components/ResponseViewer';
import HistoryPage from './pages/HistoryPage';

const queryClient = new QueryClient();

function RequestPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="h-full overflow-hidden flex flex-col">
        <RequestBuilder />
      </div>
      <div className="h-full overflow-hidden flex flex-col">
        <ResponseViewer />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CollectionsProvider>
        <RequestProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<RequestPage />} />
                <Route path="history" element={<HistoryPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </RequestProvider>
      </CollectionsProvider>
    </QueryClientProvider>
  );
}

export default App;