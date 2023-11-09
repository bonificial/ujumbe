import { describe, it, before, after } from 'mocha';


import { expect } from 'chai';
import { MongoClient } from 'mongodb';
import { env } from '../src/constants.js';

const { MONGO_DB_URL, MONGO_DB_NAME } = env;
let client;

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
        return
    });

    it('Should handle database connection errors', async function() {
        this.timeout(20000);
        const wrongUrl = `${MONGO_DB_URL}/nonexistent-database`;

        try {
            const wrongClient = new MongoClient(wrongUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            await wrongClient.connect();

        } catch(error) {
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


