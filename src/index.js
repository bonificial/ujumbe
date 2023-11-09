import { MongoClient } from 'mongodb';
import sendNotification from "./notification.js";
import http from 'http'
import {env} from "./constants.js"; // Import the config function
const { MONGO_DB_URL, MONGO_DB_NAME } = env   // Access environment variables using process.env

async function getDB() {
    try {

        const client = new MongoClient(MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect().then(()=>{
            console.log('DB Connected ...')
        })
        return client.db(MONGO_DB_NAME);
    } catch (ex) {
        console.error(ex);
    }
}

export const start = async () => {
    console.log('Connecting to DB...');
    const db = await getDB();

    const runNotificationCycle = async () => {
        const invoices = await db.collection('invoices').find({}).toArray();

        const tasks = invoices.map((invoice) =>
            new Promise((resolve, reject) => {
                const  dueDate  =  Date.parse(invoice.due_date);
                const today =   Date.now();  // Date.parse("2023-11-18");
                if (today >= dueDate) {
                    sendNotification(invoice)
                        .then(resolve)
                        .catch(reject);
                } else {
                    resolve();
                }
            })
        );
        await Promise.all(tasks);
    };
    console.log('Starting notification cycle...');
    //await runNotificationCycle() Uncomment to Test

   setInterval(runNotificationCycle, 86400000);
};
