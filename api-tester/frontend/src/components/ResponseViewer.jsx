import React from 'react';
import ReactJson from 'react-json-view';
import { useRequest } from '../hooks/useRequest';
import { marked } from 'marked';

const ResponseViewer = () => {
  const { response, error, isLoading } = useRequest();

  console.log('ResponseViewer state:', { response, error, isLoading }); // Debug log

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Response</h2>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Response Error</h2>
        <div className="text-red-600">
          {typeof error === 'string' ? error : error.message || 'An error occurred while sending the request'}
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Response</h2>
        <p className="text-gray-500">Send a request to see the response</p>
      </div>
    );
  }

  const { status, data, headers, documentation, explanation } = response;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Response</h2>
        <span
          className={`px-3 py-1 rounded text-sm ${
            status >= 200 && status < 300
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          Status: {status}
        </span>
      </div>

      <div className="space-y-6">
        {/* Response Data */}
        <div>
          <h3 className="text-lg font-medium mb-2">Response Data</h3>
          <div className="bg-gray-50 rounded p-4">
            <ReactJson
              src={data}
              theme="rjv-default"
              displayDataTypes={false}
              name={false}
            />
          </div>
        </div>

        {/* Headers */}
        <div>
          <h3 className="text-lg font-medium mb-2">Headers</h3>
          <div className="bg-gray-50 rounded p-4">
            <ReactJson
              src={headers}
              theme="rjv-default"
              displayDataTypes={false}
              name={false}
            />
          </div>
        </div>

        {/* AI Documentation or Error Explanation */}
        {documentation ? (
          <div>
            <h3 className="text-lg font-medium mb-2">AI-Generated Documentation</h3>
            <div
              className="prose prose-sm max-w-none bg-gray-50 p-4 rounded"
              dangerouslySetInnerHTML={{ __html: marked(documentation) }}
            />
          </div>
        ) : explanation ? (
          <div>
            <h3 className="text-lg font-medium mb-2">AI Error Explanation</h3>
            <div 
              className="bg-red-50 text-red-700 rounded p-4"
              dangerouslySetInnerHTML={{ __html: marked(explanation) }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ResponseViewer;