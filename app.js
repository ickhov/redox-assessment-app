import autoLoad from 'fastify-autoload';
import cors from 'fastify-cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const directoryName = dirname(filename);

export default async (fastify, opts) => {
  // CORS Header
  // accept all origin
  fastify.register(cors, {
    origin: '*',
  });

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // define the plugins in the plugins folder
  fastify.register(autoLoad, {
    dir: join(directoryName, 'plugins'),
    options: { ...opts },
  });

  // This loads all routes defined in routes
  // define the routes in the routes folder
  fastify.register(autoLoad, {
    dir: join(directoryName, 'routes'),
    options: { ...opts },
  });
};
