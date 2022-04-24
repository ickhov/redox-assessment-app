import * as readline from 'node:readline';
import fp from 'fastify-plugin';

// register the readline function
export default fp((fastify, opts, done) => {
  // store data while the server is running
  let data = null;

  // init readline
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('close', function () {
    // add an empty line for aesthetic
    console.log('');
    process.exit(0);
  });

  const getCommand = (data) => {
    rl.question('> ', (command) => {
      if (command === 'exit()') rl.close();
      try {
        const f = new Function('data', `return ${command}`);
        console.log(f(data));
      } catch (error) {
        console.log(error)
      }
      getCommand(data);
    });
  };

  // start asking for command when server is ready
  fastify.addHook('onReady', async () => {
    // onReady -> retrieve the repo data
    console.log(
      "Retrieving Ramda's repository data. Please wait a few seconds..."
    );
    // call the api to get the data
    fastify.inject(
      {
        method: 'GET',
        url: '/repositories',
      },
      (err, res) => {
        if (err != null) {
          console.log('A problem occured while starting the server.');
          process.exit(1);
        }
        console.log(
          "Ramda's repository data has been successfully retrieved..."
        );
        data = res.json();
        // print basic repo data
        let totalPRs = 0;
        data.forEach((repo) => {
          // destructure the data to print to console
          const { totalCount, data } = repo.pullRequests;
          const isSamePR = totalCount === data.length;
          totalPRs += totalCount;
          console.log(
            `${isSamePR ? 'Passed' : 'Failed'}: ${
              repo.name
            } has ${totalCount} PRs.`
          );
        });
        console.log(`Total public repositories: ${data.length}`);
        console.log(`Total PRs: ${totalPRs}`);
        // start asking for command to run
        getCommand(data);
      }
    );
  });

  done();
});
