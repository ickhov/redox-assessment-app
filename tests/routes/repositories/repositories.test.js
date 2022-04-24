/* eslint-disable no-undef */
import { expect } from 'chai';
import { build, getHeadersWithAuthToken } from '../../hooks.js';

const baseURL = '/repositories';

describe(`GET ${baseURL}`, () => {
  describe('success', () => {
    it('should return an object', async () => {
      const app = build();
      // call the API with the access token
      const res = await app.inject({
        method: 'GET',
        url: baseURL,
        headers: getHeadersWithAuthToken(),
      });
      const response = res.json();
      expect(response).to.be.an('array');
      if (response.length > 0) {
        expect(response[0]).to.have.all.keys('id', 'name', 'pullRequests');
        expect(response[0].pullRequests).to.have.all.keys('totalCount', 'data');
        expect(response[0].pullRequests.data).to.be.an('array');
        if (response[0].pullRequests.data.length > 0) {
          expect(response[0].pullRequests.data[0]).to.have.all.keys(
            'title',
            'state',
            'createdAt',
            'updatedAt',
            'mergedAt',
            'closedAt',
            'url',
            'changedFiles',
            'additions',
            'deletions',
            'number'
          );
        }
      }
    });
  });
});
