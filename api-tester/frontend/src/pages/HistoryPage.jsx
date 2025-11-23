import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRequest } from '../hooks/useRequest';

const HistoryPage = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { setRequestDraft } = useRequest();
  
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    async (id) => {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/history/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('requestHistory');
      }
    }
  );

  const clearHistoryMutation = useMutation(
    async () => {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/history`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('requestHistory');
      }
    }
  );

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <span className="w-2 h-8 bg-accent rounded-full"></span>
          Request History
        </h2>
        {history.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
                clearHistoryMutation.mutate();
              }
            }}
            className="text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded transition-colors border border-transparent hover:border-red-500/20 flex items-center gap-2"
            disabled={clearHistoryMutation.isLoading}
          >
            {clearHistoryMutation.isLoading ? 'Clearing...' : 'Clear History'}
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        {history.length === 0 ? (
          <div className="text-text-secondary text-center py-12 bg-secondary/50 rounded-lg border border-border border-dashed">
            No requests in history yet.
          </div>
        ) : (
          history.map((request) => (
            <div
              key={request._id}
              className="group bg-secondary/50 hover:bg-secondary border border-border hover:border-accent/30 rounded-lg p-4 transition-all duration-200 cursor-pointer relative"
              onClick={() => {
                setRequestDraft({
                  method: request.method,
                  url: request.url,
                  headers: request.headers,
                  body: request.body
                });
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
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this history item?')) {
                        deleteMutation.mutate(request._id);
                      }
                    }}
                    className="p-1.5 text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
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
