import React from 'react';
import ReactJson from 'react-json-view';
import { useRequest } from '../hooks/useRequest';
import { marked } from 'marked';

const ResponseViewer = () => {
  const { response, error, isLoading } = useRequest();

  console.log('ResponseViewer state:', { response, error, isLoading }); // Debug log

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-text-secondary space-y-4">
        <div className="absolute top-0 left-0 p-2 text-xs text-red-500 bg-white z-50">
          DEBUG: Loading: {isLoading.toString()}, Response: {response ? 'Yes' : 'No'}, Error: {error ? 'Yes' : 'No'}
        </div>
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-border rounded-full"></div>
          <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="animate-pulse">Processing Request...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <div className="absolute top-0 left-0 p-2 text-xs text-red-500 bg-white z-50">
          DEBUG: Loading: {isLoading.toString()}, Response: {response ? 'Yes' : 'No'}, Error: {error ? 'Yes' : 'No'}
        </div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-red-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Error
          </h2>
        </div>
        <div className="flex-1 bg-secondary/50 border border-red-500/20 rounded-lg p-6 text-red-400 font-mono text-sm overflow-auto">
          {typeof error === 'string' ? error : error.message || 'An error occurred while sending the request'}
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-text-secondary opacity-50">
        <div className="absolute top-0 left-0 p-2 text-xs text-red-500 bg-white z-50">
          DEBUG: Loading: {isLoading.toString()}, Response: {response ? 'Yes' : 'No'}, Error: {error ? 'Yes' : 'No'}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24 mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
        <p>Ready to send request</p>
      </div>
    );
  }

  const { status, data, headers, documentation, explanation } = response;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 p-2 text-xs text-red-500 bg-white z-50">
        DEBUG: Loading: {isLoading.toString()}, Response: {response ? 'Yes' : 'No'}, Error: {error ? 'Yes' : 'No'}
      </div>
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status < 300 ? 'bg-green-500' : status < 400 ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
          Response
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-secondary uppercase tracking-wider">Status</span>
          <span
            className={`px-3 py-1 rounded text-sm font-mono font-medium border ${
              status >= 200 && status < 300
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
        {/* Response Data */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider">Body</h3>
            <span className="text-xs text-text-secondary">{JSON.stringify(data).length} bytes</span>
          </div>
          <div className="bg-secondary rounded-lg border border-border overflow-hidden">
            <div className="p-4 max-h-[400px] overflow-auto custom-scrollbar">
              <ReactJson
                src={data}
                theme="ocean"
                displayDataTypes={false}
                name={false}
                style={{ backgroundColor: 'transparent', fontSize: '0.875rem' }}
              />
            </div>
          </div>
        </div>

        {/* Headers */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider">Headers</h3>
          <div className="bg-secondary rounded-lg border border-border overflow-hidden">
            <div className="p-4 max-h-[200px] overflow-auto custom-scrollbar">
              <ReactJson
                src={headers}
                theme="ocean"
                displayDataTypes={false}
                name={false}
                style={{ backgroundColor: 'transparent', fontSize: '0.875rem' }}
              />
            </div>
          </div>
        </div>

        {/* AI Documentation or Error Explanation */}
        {documentation ? (
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-accent uppercase tracking-wider flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
              </svg>
              AI Documentation
            </h3>
            <div
              className="prose prose-invert prose-sm max-w-none bg-secondary/50 border border-accent/20 p-6 rounded-lg"
              dangerouslySetInnerHTML={{ __html: marked(documentation) }}
            />
          </div>
        ) : explanation ? (
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-red-400 uppercase tracking-wider flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
              AI Error Explanation
            </h3>
            <div 
              className="prose prose-invert prose-sm max-w-none bg-red-500/10 border border-red-500/20 text-red-200 p-6 rounded-lg"
              dangerouslySetInnerHTML={{ __html: marked(explanation) }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ResponseViewer;