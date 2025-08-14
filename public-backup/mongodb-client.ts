import { MongoClient } from 'mongodb';

// Mock client for build compatibility when MONGODB_URI is not available
const mockClient = {
  db: () => ({
    collection: () => ({
      findOne: () => Promise.resolve(null),
      find: () => ({
        toArray: () => Promise.resolve([])
      }),
      insertOne: () => Promise.resolve({ insertedId: 'mock-id' }),
      updateOne: () => Promise.resolve({ modifiedCount: 1 }),
      deleteOne: () => Promise.resolve({ deletedCount: 1 })
    })
  })
};

let clientPromise: Promise<any>;

// For build compatibility, provide a mock client if no URI is available
if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI not found, using mock client for build');
  clientPromise = Promise.resolve(mockClient);
} else {
  const uri = process.env.MONGODB_URI;
  const options = {};

  let client: MongoClient;

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;
