import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, connection } from 'mongoose';

let mongoServer: MongoMemoryServer;

export const beforeAllHelper = async (done?: (...args) => void) => {
  // Set Required Env Variables
  process.env.ADMIN_CLIENT_API_KEY = 'AdminTestKey';
  process.env.ADMIN_CLIENT_API_SECRET = 'AdminTestSecret';

  // Start Mongo Memory Server
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  connect(
    mongoUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      typeof done === 'function' ? done(err) : '';
    }
  );
};

export const afterAllHelper = (done?: (...args) => void) => {
  connection.db.dropDatabase(async () => {
    await mongoServer.stop();
    connection.close((err) => {
      typeof done === 'function' ? done(err) : '';
    });
  });
};

export const cleanUp = async (done?: (...args) => void) => {
  const collections = await connection.db.listCollections().toArray();
  Promise.all(
    collections.map((collection) => connection.db.collection(collection).drop())
  ).then((err) => {
    typeof done === 'function' ? done(err) : '';
  });
};
