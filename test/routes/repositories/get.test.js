/* eslint-disable no-undef */
import { expect } from 'chai';
import {
    build,
    createTestObject,
    deleteTestObject,
    headersWithAPIKey,
    payload,
} from '../../../hooks.js';

const baseURL = '/v1/warehouses';

describe(`GET ${baseURL}`, () => {
    describe('success', () => {
        it('should return an object', async () => {
            await createTestObject();
            const app = build();
            // call the API with the access token
            const res = await app.inject({
                method: 'GET',
                url: baseURL,
                headers: headersWithAPIKey,
            });
            await deleteTestObject(payload.id);
            const response = res.json();
            expect(response).to.have.all.keys('cursor', 'data');
            expect(response.data).to.be.an('array');
            expect(response.data[0]).to.have.all.keys(
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
                method: 'GET',
                url: `${baseURL}?include=id&include=address`,
                headers: headersWithAPIKey,
            });
            await deleteTestObject(payload.id);
            const response = res.json();
            expect(response).to.have.all.keys('cursor', 'data');
            expect(response.data).to.be.an('array');
            expect(response.data[0]).to.have.all.keys('id', 'address');
        });
        it('should return an object with specific keys when exclude query param is specified', async () => {
            await createTestObject();
            const app = build();
            // call the API with the access token
            const res = await app.inject({
                method: 'GET',
                url: `${baseURL}?exclude=id&exclude=address`,
                headers: headersWithAPIKey,
            });
            await deleteTestObject(payload.id);
            const response = res.json();
            expect(response).to.have.all.keys('cursor', 'data');
            expect(response.data).to.be.an('array');
            expect(response.data[0]).to.have.all.keys(
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
});

describe(`GET ${baseURL}/:id`, () => {
    describe('success', () => {
        it('should return an object', async () => {
            await createTestObject();
            const app = build();
            // call the API with the access token
            const res = await app.inject({
                method: 'GET',
                url: `${baseURL}/${payload.id}`,
                headers: headersWithAPIKey,
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
                method: 'GET',
                url: `${baseURL}/${payload.id}?include=id&include=address`,
                headers: headersWithAPIKey,
            });
            await deleteTestObject(payload.id);
            expect(res.json()).to.have.all.keys('id', 'address');
        });
        it('should return an object with specific keys when exclude query param is specified', async () => {
            await createTestObject();
            const app = build();
            // call the API with the access token
            const res = await app.inject({
                method: 'GET',
                url: `${baseURL}/${payload.id}?exclude=id&exclude=address`,
                headers: headersWithAPIKey,
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
        it('should return 404 not found error when the warehouse does not exist', async () => {
            const app = build();
            // call the API with the access token
            const res = await app.inject({
                method: 'GET',
                url: `${baseURL}/${payload.id}`,
                headers: headersWithAPIKey,
            });
            expect(res.json()).to.deep.equal({
                statusCode: 404,
                error: 'Not Found',
                message: 'Warehouse does not exist.',
            });
        });
    });
});
