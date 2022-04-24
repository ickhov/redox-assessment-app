# Redox Assessment App

Redox Assessment App written using NodeJS and Fastify.

## Set up the project

Create a personal access token on GitHub with the following permissions:
- repo:status
- repo_deployment
- public_repo
- read:org
- read:public_key
- read:repo_hook
- read:user
- read:gpg_key

Create an .env file and copy and paste the following data to the file
```
NODE_ENV=development
PORT=8000
GITHUB_API_URL=https://api.github.com/graphql
TOKEN=paste-your-personal-oauth-token-here
CACHE_TTL=60
```

Install the dependencies
```
npm install
```

## Run the project

Run the following command
```
npm start
```

## Access the data through console

After running the project, it'll take awhile to start since it's retrieving the Ramda's repository data. After, we can start looking through the data using the console by typing in functions such as
```
> data.length
```
OR
```
> data[1].pullRequests.data.filter(e => new Date(e.mergedAt) > new Date('2014-11-30T22:24:11Z'))
```
The console has knowledge of the data through the **data** variable. You can type in any valid functions and it'll return the response. The drawback, however, is that you can only call single line function.

Here is the structure of **data**:
```
[
  {
    "id": "MDEwOlJlcG9zaXRvcnkxMDg1MTgyMA==",
    "name": "ramda",
    "pullRequests": {
      "totalCount": 1696,
      "data": [
        {
          "title": "refactor: `of` now works with Applicatives",
          "state": "OPEN",
          "createdAt": "2022-04-19T08:37:20Z",
          "updatedAt": "2022-04-21T07:32:15Z",
          "mergedAt": null,
          "closedAt": null,
          "url": "https://github.com/ramda/ramda/pull/3272",
          "changedFiles": 6,
          "additions": 72,
          "deletions": 45,
          "number": 3272
        },
        ...
      ]
    }
  },
  ...
]
```

## Access the API through the browser

You can access the API through http://0.0.0.0:8000 and the available endpoints are:
- /
- /repositories

**Note**: It takes awhile to load the repositories endpoint as there are a lot of PR data to retrieve from GitHub.

## Test the project

Run all the test scripts
```
npm test test/routes/*
```
Run a specific test script
```
npm test test/routes/root
```

**Note**: Due to the nature of the app, I removed the timeout check for the test since it will automatically fail if the API takes too long to respond. I only need to test the API to test the plugins since the API uses the plugins.