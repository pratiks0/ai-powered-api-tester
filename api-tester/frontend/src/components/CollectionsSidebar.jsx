import React, { useState } from 'react';
import { useCollections } from '../context/CollectionsContext';

const CollectionsSidebar = () => {
  const {
    collections,
    currentCollection,
    setCurrentCollection,
    createCollection,
    deleteCollection
  } = useCollections();

  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    try {
      await createCollection({
        name: newCollectionName,
        description: newCollectionDescription
      });
      setNewCollectionName('');
      setNewCollectionDescription('');
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Collections</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="text-blue-600 hover:text-blue-800"
        >
          + New
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateCollection} className="mb-4 space-y-2">
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Collection Name"
            className="w-full rounded border-gray-300 text-sm"
            required
          />
          <textarea
            value={newCollectionDescription}
            onChange={(e) => setNewCollectionDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full rounded border-gray-300 text-sm"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-gray-600 px-3 py-1 rounded text-sm hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {collections.map((collection) => (
          <div
            key={collection._id}
            className={`p-2 rounded cursor-pointer ${
              currentCollection?._id === collection._id
                ? 'bg-blue-50 border border-blue-200'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setCurrentCollection(collection)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{collection.name}</h3>
                {collection.description && (
                  <p className="text-sm text-gray-600">{collection.description}</p>
                )}
                <p className="text-xs text-gray-500">
                  {collection.requests?.length || 0} requests
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCollection(collection._id);
                }}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionsSidebar;