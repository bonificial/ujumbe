import { describe, it, before, after } from 'mocha';


import { expect } from 'chai';
import { start } from '../src/index.js';
import { MongoClient } from 'mongodb';
import {assert} from "chai";
import { env } from '../src/constants.js';

const { MONGO_DB_URL, MONGO_DB_NAME } = env;
let client;

console.log('test env',env)
describe('Database Connection', function () {
    before(async function() {
        this.timeout(10000);
        // Connect to the database before running the tests
        client = new MongoClient(MONGO_DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await client.connect(); // Returning a Promise

    });

    after(async function () {
        await client.close();
    });

    it('Should connect to the database successfully', async function () {
        this.timeout(10000);
        //console.log(client)
        const db = await client.db(MONGO_DB_NAME);
        expect(db).to.exist;
    });

    it('Should handle database connection errors', async function () {
        const wrongUrl = `${MONGO_DB_URL}/nonexistent-database`;
        const wrongClient = new MongoClient(wrongUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        try {
            await wrongClient.connect();
        } catch (error) {
            console.log(error)
            expect(error).to.be.an('error');
        }
    });

    it('Should be able to retrieve data from the database', async function () {
        const db = client.db(MONGO_DB_NAME);
        const collection = db.collection('invoices');
        const invoices = await collection.find({}).toArray();
        expect(invoices).to.be.an('array');
    });

    it('Should handle errors when retrieving data', async function () {
        const db = client.db(MONGO_DB_NAME);
        const collection = db.collection('nonexistent_collection');

        try {
            await collection.find({}).toArray();
            // Remove the following line since you don't need to expect an AssertionError here.
        } catch (error) {

            expect(error).to.be.an('error');
        }
    });
});

describe('Notification Sending', function () {
    it('Should send a notification successfully', async function () {
        const mockNotification = function (invoice) {
            expect(invoice).to.exist;
        };

        let originalStart;

        before(function () {
            // Save the original 'start' function
            originalStart = start;
        });

        after(function () {
            // Restore the original 'start' function
            originalStart = start;
        });

        beforeEach(function () {
            // Mock the 'start' function
            start = async () => {
                mockNotification({ });
            };
        });

        afterEach(function () {
            // Restore the original 'start' function after each test
            originalStart = start;
        });

        it('Sends a notification successfully', async function () {
            await start(); // Calls the mocked 'start' function
        });

    });
});

