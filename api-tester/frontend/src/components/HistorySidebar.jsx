import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

const HistorySidebar = () => {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, refetch } = useQuery(['requestHistory', page], async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/history?page=${page}`);
    return response.data;
  });

  const history = data?.history || [];

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Request History</h2>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const getMethodStyle = (method) => {
    const styles = {
      GET: 'bg-blue-100 text-blue-800',
      POST: 'bg-green-100 text-green-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      PATCH: 'bg-purple-100 text-purple-800',
      DELETE: 'bg-red-100 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return styles[method] || styles.default;
  };

  if (data?.error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Request History</h2>
        <div className="text-red-500">Error loading history: {data.error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Request History</h2>
      
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            No requests in history
          </div>
        ) : (
          history.map((request) => (
            <div
              key={request._id}
              className="p-3 border rounded hover:bg-gray-50 cursor-pointer transition duration-150"
            >
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodStyle(request.method)}`}>
                  {request.method}
                </span>
                <span className="text-sm text-gray-600 truncate flex-1">
                  {request.url}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-400 flex justify-between items-center">
                <span>{new Date(request.createdAt).toLocaleString()}</span>
                {request.response && (
                  <span className={`px-2 py-1 rounded text-xs font-medium 
                    ${request.response.status < 300 ? 'bg-green-50 text-green-700' : 
                     request.response.status < 400 ? 'bg-yellow-50 text-yellow-700' : 
                     'bg-red-50 text-red-700'}`}>
                    {request.response.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {data?.pagination && (
        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="text-gray-500">
            Page {data.pagination.currentPage} of {data.pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={data.pagination.currentPage === 1}
              onClick={() => refetch({ page: data.pagination.currentPage - 1 })}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={data.pagination.currentPage === data.pagination.totalPages}
              onClick={() => refetch({ page: data.pagination.currentPage + 1 })}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorySidebar;