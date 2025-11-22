import React, { createContext, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading, error, data } = useMutation(
    async (requestData) => {
      console.log('RequestContext: Sending request:', requestData);
      
      let parsedData = { ...requestData };
      
      // Handle body parsing
      if (requestData.body && typeof requestData.body === 'string' && requestData.method !== 'GET') {
        try {
          parsedData.body = JSON.parse(requestData.body);
        } catch (err) {
          console.error('Body parsing error:', err);
          throw new Error('Invalid JSON in request body');
        }
      }

      // Handle headers parsing
      if (requestData.headers && typeof requestData.headers === 'string') {
        try {
          parsedData.headers = JSON.parse(requestData.headers);
        } catch (err) {
          console.error('Headers parsing error:', err);
          throw new Error('Invalid JSON in headers');
        }
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log('RequestContext: Making axios request to:', `${apiUrl}/api/request`, parsedData);
        const response = await axios.post(
          `${apiUrl}/api/request`,
          parsedData
        );
        console.log('RequestContext: Response received:', response.data);
        return response.data;
      } catch (err) {
        console.error('RequestContext: Request error:', err);
        if (err.response) {
          throw err.response.data.error || 'Server error';
        }
        throw err.message || 'Network error';
      }
    },
    {
      onSuccess: () => {
        console.log('RequestContext: Mutation onSuccess triggered');
        // Invalidate and refetch request history
        queryClient.invalidateQueries('requestHistory');
      },
      onError: (err) => {
        console.error('RequestContext: Mutation onError triggered:', err);
      }
    }
  );

  const value = {
    sendRequest: mutate,
    isLoading,
    error,
    response: data
  };

  return (
    <RequestContext.Provider value={value}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequestContext = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequestContext must be used within a RequestProvider');
  }
  return context;
};
