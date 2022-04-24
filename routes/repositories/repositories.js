export default async (fastify, request, reply) => {
  const orgName = 'ramda';
  try {
    // get all repositories
    const repositories = await fastify.queries.getRepositories(orgName);
    // get all the requests to retrieve the pull requests
    const pullRequestPromises = repositories.map((repo) => {
      const { name } = repo;
      return fastify.queries.getPullRequests(orgName, name);
    });
    // run the async tasks (order is preserved)
    const pullRequests = await Promise.all(pullRequestPromises);
    // insert the pull request data into its respective repositories
    const response = repositories.map((repo, index) => {
      const repoCopy = { ...repo };
      // update the pullRequests key with the totalCount and PR data
      repoCopy.pullRequests = {
        ...repoCopy.pullRequests,
        data: pullRequests[index],
      };
      return repoCopy;
    });
    reply.send(response);
  } catch (error) {
    console.log('Error', error);
    const response = { error: error.message() };
    reply.status(400).send(response);
  }
};
