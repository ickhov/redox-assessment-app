/* eslint-disable no-undef */
import { expect } from 'chai';
import { build } from '../hooks.js';

const baseURL = '/';

describe(`GET ${baseURL}`, () => {
  describe('success', () => {
    it('should return an object', async () => {
      const app = build();
      // call the API with the access token
      const res = await app.inject({
        method: 'GET',
        url: baseURL,
      });
      expect(res.json()).to.deep.equal({
        root: true,
      });
    });
  });
});
