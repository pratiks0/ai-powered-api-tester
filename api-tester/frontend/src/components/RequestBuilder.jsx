import React, { useState } from 'react';
import { useRequest } from '../hooks/useRequest';

const RequestBuilder = () => {
  const [request, setRequest] = useState({
    method: 'GET',
    url: '',
    headers: '{}',
    body: ''
  });

  const [headerError, setHeaderError] = useState('');
  const [bodyError, setBodyError] = useState('');
  
  const { sendRequest, isLoading } = useRequest();

  const validateAndSubmit = (e) => {
    e.preventDefault();
    setHeaderError('');
    setBodyError('');

    // Always pass headers as a string, let the hook handle parsing
    const requestData = {
      ...request,
      headers: request.headers || '{}',
      body: request.body || ''
    };

    console.log('Submitting request:', requestData); // Debug log
    
    // Send the request
    try {
      sendRequest(requestData);
    } catch (error) {
      console.error('Request submission error:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Request Builder</h2>
      
      <form onSubmit={validateAndSubmit} className="space-y-4">
        <div className="flex gap-4">
          <select
            value={request.method}
            onChange={(e) => setRequest({ ...request, method: e.target.value })}
            className="rounded border-gray-300 px-3 py-2"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>PATCH</option>
            <option>DELETE</option>
          </select>
          
          <input
            type="url"
            value={request.url}
            onChange={(e) => setRequest({ ...request, url: e.target.value })}
            placeholder="Enter API URL"
            className="flex-1 rounded border-gray-300 px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Headers (JSON)
          </label>
          <textarea
            value={request.headers}
            onChange={(e) => {
              setHeaderError('');
              setRequest({ ...request, headers: e.target.value });
            }}
            placeholder={'{\n  "Content-Type": "application/json"\n}'}
            className={`w-full rounded font-mono text-sm p-3 ${
              headerError ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={4}
          />
          {headerError && (
            <p className="mt-1 text-sm text-red-600">{headerError}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Body (JSON)
          </label>
          <textarea
            value={request.body}
            onChange={(e) => {
              setBodyError('');
              setRequest({ ...request, body: e.target.value });
            }}
            placeholder={'{\n  "key": "value"\n}'}
            className={`w-full rounded font-mono text-sm p-3 ${
              bodyError ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={6}
            disabled={request.method === 'GET'}
          />
          {bodyError && (
            <p className="mt-1 text-sm text-red-600">{bodyError}</p>
          )}
          {request.method === 'GET' && (
            <p className="mt-1 text-sm text-gray-500">
              Body is not allowed for GET requests
            </p>
          )}
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          disabled={isLoading || !request.url.trim()}
        >
          {isLoading ? 'Sending...' : 'Send Request'}
        </button>
      </form>
    </div>
  );
};

export default RequestBuilder;