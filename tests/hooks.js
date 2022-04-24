// This file contains code that we reuse
// between our tests.
import dotenv from 'dotenv';
// import the framework itself
import Fastify from 'fastify';
// register your application as a normal plugin.
import App from './app.test.js';

// read the .env file.
dotenv.config();

let app;
export const build = () => app;

export const getHeadersWithAuthToken = () => ({
  authorization: `Bearer ${process.env.TOKEN}`,
});

export const mochaGlobalSetup = async () => {
  app = Fastify();
  app.register(App);
  console.log("Loading server's plugins...");
  await app.ready();
  console.log(`Server is running...`);
};

export const mochaGlobalTeardown = async () => {
  console.log(`Server is closing...`);
  app.close();
  console.log('Server has stopped!');
  process.exit(0);
};
