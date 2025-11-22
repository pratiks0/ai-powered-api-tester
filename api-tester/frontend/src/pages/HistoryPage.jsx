import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  
  const { data, isLoading, refetch } = useQuery(['requestHistory', page], async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/history?page=${page}`);
    return response.data;
  });

  const history = data?.history || [];

  const getMethodStyle = (method) => {
    const styles = {
      GET: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      POST: 'bg-green-500/10 text-green-400 border-green-500/20',
      PUT: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      PATCH: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      DELETE: 'bg-red-500/10 text-red-400 border-red-500/20',
      default: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    };
    return styles[method] || styles.default;
  };

  const getStatusStyle = (status) => {
    if (status < 300) return 'text-green-400';
    if (status < 400) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-text-primary">Request History</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-secondary rounded-lg border border-border"></div>
          ))}
        </div>
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          Error loading history: {data.error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-text-primary flex items-center gap-3">
        <span className="w-2 h-8 bg-accent rounded-full"></span>
        Request History
      </h2>
      
      <div className="space-y-3">
        {history.length === 0 ? (
          <div className="text-text-secondary text-center py-12 bg-secondary/50 rounded-lg border border-border border-dashed">
            No requests in history yet.
          </div>
        ) : (
          history.map((request) => (
            <div
              key={request._id}
              className="group bg-secondary/50 hover:bg-secondary border border-border hover:border-accent/30 rounded-lg p-4 transition-all duration-200 cursor-pointer"
              onClick={() => {
                // In a real app, this would load the request into the builder
                // For now, we'll just navigate to home
                navigate('/');
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span className={`px-2.5 py-1 rounded text-xs font-medium border ${getMethodStyle(request.method)}`}>
                    {request.method}
                  </span>
                  <span className="text-text-primary font-mono text-sm truncate" title={request.url}>
                    {request.url}
                  </span>
                </div>
                
                <div className="flex items-center gap-6 text-sm ml-4">
                  <span className="text-text-secondary text-xs">
                    {new Date(request.createdAt).toLocaleString()}
                  </span>
                  {request.response && (
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${getStatusStyle(request.response.status)}`}>
                        {request.response.status}
                      </span>
                      <span className="text-text-secondary text-xs">
                        {request.response.statusText || 'OK'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {data?.pagination && (
        <div className="mt-8 flex justify-between items-center text-sm border-t border-border pt-6">
          <div className="text-text-secondary">
            Page <span className="text-text-primary font-medium">{data.pagination.currentPage}</span> of {data.pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-md border border-border bg-secondary hover:bg-white/5 text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={data.pagination.currentPage === 1}
              onClick={() => {
                setPage(p => Math.max(1, p - 1));
                refetch();
              }}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 rounded-md border border-border bg-secondary hover:bg-white/5 text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={data.pagination.currentPage === data.pagination.totalPages}
              onClick={() => {
                setPage(p => p + 1);
                refetch();
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
