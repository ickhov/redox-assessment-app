/* eslint-disable no-undef */
import { expect } from 'chai';
import {
    build,
    createTestObject,
    deleteTestObject,
    getHeadersWithAuthToken,
    payload,
} from '../../../hooks.js';

const baseURL = '/v1/warehouses';

describe(`POST ${baseURL}`, () => {
    describe('success', () => {
        it('should return an object', async () => {
            const app = build();
            // call the API with the access token
            const res = await app.inject({
                method: 'POST',
                url: baseURL,
                payload,
                headers: getHeadersWithAuthToken(),
            });
            await deleteTestObject(payload.id);
            expect(res.json()).to.have.all.keys(
                'id',
                'created_at',
                'updated_at',
                'address',
                'address_2',
                'city',
                'state',
                'country',
                'zip_code',
                'capacity',
                'pallet_capacity'
            );
        });
    });
    describe('error', () => {
        it('should return 400 validation error when one or more of the required keys are missing', async () => {
            const app = build();
            // call the API with the access token
            const res = await app.inject({
                method: 'POST',
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
        it('should return 409 unique violation error when the warehouse already exist', async () => {
            await createTestObject();
            const app = build();
            const res = await app.inject({
                method: 'POST',
                url: baseURL,
                payload,
                headers: getHeadersWithAuthToken(),
            });
            await deleteTestObject(payload.id);
            const response = res.json();
            // check for the correct keys
            expect(response).to.have.all.keys('statusCode', 'error', 'message');
            // check for the correct statusCode value
            expect(response.statusCode).to.equal(409);
            // check for the correct error message
            expect(response.error).to.have.string('Unique Violation Error');
            // check that message is a string
            expect(response.message).to.be.a('string');
        });
    });
});
