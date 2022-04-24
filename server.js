import dotenv from 'dotenv';
// import the framework itself
import Fastify from 'fastify';
// register your application as a normal plugin.
import appService from './app.js';

// read the .env file.
dotenv.config();

// instantiate Fastify with some config
const app = Fastify();

app.register(appService);

// start listening.
app.listen(process.env.PORT || 8000, '0.0.0.0', (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
