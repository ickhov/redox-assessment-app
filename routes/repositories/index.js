import repositories from './repositories.js';

export default async (fastify) => {
  fastify.get('/', (request, reply) => repositories(fastify, request, reply));
};
