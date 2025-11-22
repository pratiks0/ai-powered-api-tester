import axios from 'axios';
import RequestHistory from '../models/RequestHistory.js';
import { generateDocumentation, explainError } from '../services/aiService.js';

export const sendRequest = async (req, res) => {
  try {
    const { method, url, headers = {}, body } = req.body;

    // Validate required fields
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!method) {
      return res.status(400).json({ error: 'HTTP method is required' });
    }

    // Make the API request
    const response = await axios({
      method: method.toLowerCase(),
      url,
      headers,
      data: body,
      validateStatus: false // Don't throw error for non-2xx responses
    });

    // Save to history
    try {
      await RequestHistory.create({
        method,
        url,
        headers,
        body,
        response: {
          status: response.status,
          headers: response.headers,
          data: response.data
        }
      });
    } catch (historyError) {
      console.error('Error saving to history:', historyError);
      // Don't fail the request if history save fails
    }

    // Generate documentation or error explanation based on response status
    let documentation;
    let explanation;

    if (response.status >= 200 && response.status < 300) {
      documentation = await generateDocumentation({
        method,
        url,
        response: response.data,
        statusCode: response.status
      });
    } else {
      explanation = await explainError({
        error: response.data,
        statusCode: response.status
      });
    }

    res.json({
      status: response.status,
      data: response.data,
      headers: response.headers,
      documentation,
      explanation
    });

  } catch (error) {
    console.error('Request error:', error);
    
    let errorResponse;
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code outside 2xx
      const errorExplanation = await explainError({
        error: error.response.data,
        statusCode: error.response.status
      });

      errorResponse = {
        status: error.response.status,
        error: error.response.data,
        explanation: errorExplanation
      };

    } else if (error.request) {
      // The request was made but no response was received
      errorResponse = {
        status: 503,
        error: 'No response received from server',
        explanation: 'The server is unreachable or not responding'
      };

    } else {
      // Error setting up the request
      errorResponse = {
        status: 500,
        error: error.message,
        explanation: 'An error occurred while processing your request'
      };
    }

    res.status(errorResponse.status).json(errorResponse);
  }
};

export const getHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get paginated history
    const [history, total] = await Promise.all([
      RequestHistory.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-response.data'), // Exclude response data for performance
      RequestHistory.countDocuments()
    ]);

    res.json({
      history,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch request history',
      details: error.message
    });
  }
};