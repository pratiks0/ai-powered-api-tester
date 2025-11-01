import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const CollectionsContext = createContext();

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
};

export const CollectionsProvider = ({ children }) => {
  const [collections, setCollections] = useState([]);
  const [currentCollection, setCurrentCollection] = useState(null);

  const fetchCollections = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/collections`);
      setCollections(response.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const createCollection = async (collectionData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/collections`,
        collectionData
      );
      setCollections([...collections, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  };

  const updateCollection = async (id, collectionData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/collections/${id}`,
        collectionData
      );
      setCollections(
        collections.map(c => c._id === id ? response.data : c)
      );
      return response.data;
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    }
  };

  const deleteCollection = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/collections/${id}`);
      setCollections(collections.filter(c => c._id !== id));
      if (currentCollection?._id === id) {
        setCurrentCollection(null);
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw error;
    }
  };

  const addRequestToCollection = async (collectionId, requestData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/collections/${collectionId}/requests`,
        requestData
      );
      setCollections(
        collections.map(c => c._id === collectionId ? response.data : c)
      );
      if (currentCollection?._id === collectionId) {
        setCurrentCollection(response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Error adding request to collection:', error);
      throw error;
    }
  };

  return (
    <CollectionsContext.Provider
      value={{
        collections,
        currentCollection,
        setCurrentCollection,
        fetchCollections,
        createCollection,
        updateCollection,
        deleteCollection,
        addRequestToCollection
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};