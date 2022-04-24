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

describe(`PUT ${baseURL}/:id`, () => {
    describe('success', () => {
        it('should return an object', async () => {
            await createTestObject();
            const app = build();
            // call the API with the access token
            const res = await app.inject({
                method: 'PUT',
                url: `${baseURL}/${payload.id}`,
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
        it('should return an object with specific keys when include query param is specified', async () => {
            await createTestObject();
            const app = build();
            // call the API with the access token
            const res = await app.inject({
                method: 'PUT',
                url: `${baseURL}/${payload.id}?include=id&include=address`,
                payload,
                headers: getHeadersWithAuthToken(),
            });
            await deleteTestObject(payload.id);
            expect(res.json()).to.have.all.keys('id', 'address');
        });
        it('should return an object with specific keys when exclude query param is specified', async () => {
            await createTestObject();
            const app = build();
            // call the API with the access token
            const res = await app.inject({
                method: 'PUT',
                url: `${baseURL}/${payload.id}?exclude=id&exclude=address`,
                payload,
                headers: getHeadersWithAuthToken(),
            });
            await deleteTestObject(payload.id);
            expect(res.json()).to.have.all.keys(
                'created_at',
                'updated_at',
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
        it('should return 400 validation error when id or one or more of the required keys are missing', async () => {
            const app = build();
            // call the API with the access token
            const res = await app.inject({
                method: 'PUT',
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
                method: 'PUT',
                url: `${baseURL}/${payload.id}`,
                payload,
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
