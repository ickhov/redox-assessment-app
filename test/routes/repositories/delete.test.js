/* eslint-disable no-undef */
import { expect } from 'chai';
import {
    build,
    createTestObject,
    deleteTestObject,
    getHeadersWithAuthToken,
    payload,
} from '../../hooks.js';

const baseURL = '/v1/warehouses';

describe(`DELETE ${baseURL}/:id`, () => {
    describe('success', () => {
        it('should return an object', async () => {
            await createTestObject();
            const app = build();
            // call the API with the access token
            const res = await app.inject({
                method: 'DELETE',
                url: `${baseURL}/${payload.id}`,
                headers: getHeadersWithAuthToken(),
            });
            expect(res.statusCode).to.equal(204);
        });
    });
    describe('error', () => {
        it('should return 400 validation error when one or more of the required keys are missing', async () => {
            const app = build();
            const res = await app.inject({
                method: 'DELETE',
                url: baseURL,
                headers: getHeadersWithAuthToken(),
            });
            const response = res.json();
            // check for the correct keys
            expect(response).to.have.all.keys('statusCode', 'error', 'message');
            // check for the correct statusCode value
            expect(response.statusCode).to.equal(400);
            // check for the correct error message
            expect(response.error).to.have.string('Validation Error:');
            // check that message is an array
            expect(response.message).to.be.an('array');
        });
        it('should return 404 not found error when the warehouse does not exist', async () => {
            // make sure id is not taken already
            await createTestObject();
            await deleteTestObject(payload.id);
            const app = build();
            // call the API with the access token
            const res = await app.inject({
                method: 'DELETE',
                url: `${baseURL}/${payload.id}`,
                headers: getHeadersWithAuthToken(),
            });
            expect(res.json()).to.deep.equal({
                statusCode: 404,
                error: 'Not Found',
                message: 'Warehouse does not exist.',
            });
        });
    });
});
