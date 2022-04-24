# Redox Assessment App

Redox Assessment App written using NodeJS and Fastify.

## Set up the project

Create a personal access token with the following permissions:
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
Access the API through http://0.0.0.0:8000

## Test the project

Run all the test scripts
```
npm test test/api
```
Run a specific test script
```
npm test test/api/ping.test.js
```