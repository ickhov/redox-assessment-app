import axios from 'axios';
import fp from 'fastify-plugin';

// register the readline function
export default fp((fastify, opts, done) => {
  const dataURL = process.env.GITHUB_API_URL;
  const token = process.env.TOKEN;
  const headers = { Authorization: `Bearer ${token}` };

  // get all the repos for the org
  const getRepositories = async (orgName) => {
    const allRepositories = [];
    let cursor = null;
    let hasNextPage = false;
    do {
      // generate cursor string for next page if exist
      const cursorStr = cursor != null ? `, after: "${cursor}"` : '';
      const query = `
        query {
          organization(login: "${orgName}") {
            repositories(first: 100${cursorStr}) {
              pageInfo {
                endCursor
                hasNextPage
              }
              edges {
                node {
                  id
                  name
                  pullRequests {
                    totalCount
                  }
                }
              }
            }
          }
        }
      `;
      const response = await axios.post(dataURL, JSON.stringify({ query }), {
        headers,
      });
      const { data } = response.data;
      const { repositories } = data.organization;
      // grab the repo data from node and insert it into an array
      const repos = repositories.edges.map((r) => r.node);
      // set new cursor and whether there's next page
      cursor = repositories.pageInfo.endCursor;
      hasNextPage = repositories.pageInfo.hasNextPage;
      // append the repo data to the parent array
      allRepositories.push(...repos);
    } while (hasNextPage);
    // reurn all the repos for the org
    return allRepositories;
  };

  // get pull requests for the specified repo
  const getPullRequests = async (orgName, repoName) => {
    const allPullRequests = [];
    let cursor = null;
    let hasNextPage = false;
    do {
      // generate cursor string for next page if exist
      const cursorStr = cursor != null ? `, after: "${cursor}"` : '';
      const query = `
        query {
          repository(name: "${repoName}", owner: "${orgName}") {
            pullRequests(first: 100${cursorStr}, orderBy: {field: CREATED_AT, direction: DESC}) {
              pageInfo {
                endCursor
                hasNextPage
              }
              nodes {
                title
                state
                createdAt
                updatedAt
                mergedAt
                closedAt
                url
                changedFiles
                additions
                deletions
                number
              }
            }
          }
        }
      `;
      const response = await axios.post(dataURL, JSON.stringify({ query }), {
        headers,
      });
      const { data } = response.data;
      const { pullRequests } = data.repository;
      // set new cursor and whether there's next page
      cursor = pullRequests.pageInfo.endCursor;
      hasNextPage = pullRequests.pageInfo.hasNextPage;
      // append the pull request data to the parent array
      allPullRequests.push(...pullRequests.nodes);
    } while (hasNextPage);
    // return all the pull requests for repo
    return allPullRequests;
  };

  fastify.decorate('queries', {
    getRepositories,
    getPullRequests,
  });

  done();
});
