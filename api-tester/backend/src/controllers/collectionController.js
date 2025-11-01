import Collection from '../models/Collection.js';

// Get all collections
export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ updatedAt: -1 });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single collection by ID
export const getCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new collection
export const createCollection = async (req, res) => {
  try {
    const { name, description, requests } = req.body;
    const collection = new Collection({
      name,
      description,
      requests: requests || []
    });
    await collection.save();
    res.status(201).json(collection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a collection
export const updateCollection = async (req, res) => {
  try {
    const { name, description, requests } = req.body;
    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      { name, description, requests },
      { new: true, runValidators: true }
    );
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    res.json(collection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a collection
export const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a request to a collection
export const addRequest = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    collection.requests.push(req.body);
    await collection.save();
    res.status(201).json(collection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remove a request from a collection
export const removeRequest = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    collection.requests = collection.requests.filter(
      request => request._id.toString() !== req.params.requestId
    );
    await collection.save();
    res.json(collection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};