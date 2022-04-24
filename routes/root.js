export default async (fastify) => {
  fastify.get('/', async () => ({ root: true }));
};
