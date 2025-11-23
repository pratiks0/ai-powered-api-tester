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
  
  const { sendRequest, isLoading, requestDraft } = useRequest();

  // Update local state when requestDraft changes (e.g. from history)
  React.useEffect(() => {
    if (requestDraft) {
      setRequest({
        method: requestDraft.method || 'GET',
        url: requestDraft.url || '',
        headers: typeof requestDraft.headers === 'string' 
          ? requestDraft.headers 
          : JSON.stringify(requestDraft.headers || {}, null, 2),
        body: typeof requestDraft.body === 'string'
          ? requestDraft.body
          : JSON.stringify(requestDraft.body || {}, null, 2)
      });
    }
  }, [requestDraft]);

  const validateAndSubmit = (e) => {
    if (e) e.preventDefault();
    setHeaderError('');
    setBodyError('');

    const requestData = {
      ...request,
      headers: request.headers || '{}',
      body: request.body || ''
    };

    console.log('RequestBuilder: Submitting request:', requestData);
    sendRequest(requestData);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <span className="w-2 h-2 bg-accent rounded-full"></span>
          Request Builder
        </h2>
      </div>
      
      <form className="space-y-6 flex-1 flex flex-col">
        <div className="flex gap-0 rounded-lg overflow-hidden border border-border shadow-sm">
          <select
            value={request.method}
            onChange={(e) => setRequest({ ...request, method: e.target.value })}
            className="bg-secondary text-text-primary font-medium px-4 py-3 border-r border-border focus:outline-none focus:bg-white/5 transition-colors cursor-pointer hover:bg-white/5"
          >
            <option className="bg-secondary">GET</option>
            <option className="bg-secondary">POST</option>
            <option className="bg-secondary">PUT</option>
            <option className="bg-secondary">PATCH</option>
            <option className="bg-secondary">DELETE</option>
          </select>
          
          <input
            type="url"
            value={request.url}
            onChange={(e) => setRequest({ ...request, url: e.target.value })}
            placeholder="Enter API URL"
            className="flex-1 bg-secondary text-text-primary px-4 py-3 focus:outline-none focus:bg-white/5 transition-colors placeholder-text-secondary/50"
            required
          />
          
          <button
            type="button"
            onClick={validateAndSubmit}
            className="bg-accent text-white px-6 py-3 font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            disabled={isLoading || !request.url.trim()}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                Send
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </>
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
          <div className="flex flex-col min-h-0">
            <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
              Headers (JSON)
            </label>
            <div className={`flex-1 rounded-lg border ${headerError ? 'border-red-500/50' : 'border-border'} bg-secondary overflow-hidden focus-within:border-accent/50 transition-colors`}>
              <textarea
                value={request.headers}
                onChange={(e) => {
                  setHeaderError('');
                  setRequest({ ...request, headers: e.target.value });
                }}
                placeholder={'{\n  "Content-Type": "application/json"\n}'}
                className="w-full h-full bg-transparent text-text-primary font-mono text-sm p-4 focus:outline-none resize-none placeholder-text-secondary/30"
                spellCheck="false"
              />
            </div>
            {headerError && (
              <p className="mt-1 text-xs text-red-400">{headerError}</p>
            )}
          </div>
          
          <div className="flex flex-col min-h-0">
            <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
              Body (JSON)
            </label>
            <div className={`flex-1 rounded-lg border ${bodyError ? 'border-red-500/50' : 'border-border'} bg-secondary overflow-hidden focus-within:border-accent/50 transition-colors relative`}>
              <textarea
                value={request.body}
                onChange={(e) => {
                  setBodyError('');
                  setRequest({ ...request, body: e.target.value });
                }}
                placeholder={'{\n  "key": "value"\n}'}
                className="w-full h-full bg-transparent text-text-primary font-mono text-sm p-4 focus:outline-none resize-none placeholder-text-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                spellCheck="false"
                disabled={request.method === 'GET'}
              />
              {request.method === 'GET' && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary/50 backdrop-blur-[1px]">
                  <span className="text-text-secondary text-sm bg-primary/80 px-3 py-1 rounded border border-border">
                    Body not allowed for GET
                  </span>
                </div>
              )}
            </div>
            {bodyError && (
              <p className="mt-1 text-xs text-red-400">{bodyError}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default RequestBuilder;
