import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

export const useRequest = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading, error, data } = useMutation(
    async (requestData) => {
      console.log('Sending request:', requestData); // Debug log
      
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
        console.log('Making request to backend:', parsedData); // Debug log
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/request`,
          parsedData
        );
        console.log('Response received:', response.data); // Debug log
        return response.data;
      } catch (err) {
        console.error('Request error:', err); // Debug log
        if (err.response) {
          throw err.response.data.error || 'Server error';
        }
        throw err.message || 'Network error';
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch request history
        queryClient.invalidateQueries('requestHistory');
      }
    }
  );

  return { sendRequest: mutate, isLoading, error, response: data };
};