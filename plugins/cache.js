import fp from 'fastify-plugin';
import NodeCache from 'node-cache';

// register the s3 adapter
export default fp((fastify, opts, done) => {
  // init the ttl and cache instance
  const ttl = parseInt(process.env.CACHE_TTL || '60', 10);
  const cache = new NodeCache({ stdTTL: ttl });

  // a hook to cache a GET request
  fastify.addHook('onRequest', async (request, reply) => {
    if (request.method === 'GET') {
      const response = cache.get(request.url);
      if (response !== undefined) {
        reply
          .code(200)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send(response);
      }
    }
  });
  // a hook to cache the data before sending the response to the client
  fastify.addHook('onSend', async (request, reply, payload) => {
    if (request.method === 'GET') {
      const response = cache.get(request.url);
      if (reply.statusCode < 400 && response === undefined) {
        cache.set(request.url, payload);
      }
    }
  });
  done();
});
