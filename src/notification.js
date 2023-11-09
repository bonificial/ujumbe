import {IncomingWebhook} from "@slack/webhook";
import {env} from "./constants.js";
import fetch from 'node-fetch';
const {SLACK_WEBHOOK, BREVO_API_KEY, TEST_BUSINESS_NAME, TEST_FROM_EMAIL, TEST_TO_EMAIL} = env

const webhook = new IncomingWebhook(SLACK_WEBHOOK);

export const sendNotification = async (invoice) => {
    console.log('Sending notification..')
    const {invoice_number, total_amount_due, due_date} = invoice;
    await webhook.send({
        text: `Hi There!\n The invoice ${invoice_number} of Kshs. ${total_amount_due} is due on ${due_date}`,
    }).then((res=>{
        console.log(' Successful. Notification Sent. ',res)
    }))
    await sendEmail(invoice);
}


export const sendEmail = async (invoice) => {
    console.log('Sending Email')
    const {invoice_number, total_amount_due, due_date} = invoice;
    const customer_name = invoice?.customer?.name || 'Valued Client'
    const customer_email = invoice?.customer?.email || TEST_TO_EMAIL
    fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': BREVO_API_KEY,
            'content-type': 'application/json'
        },
        // body: '{  \n   "sender":{  \n      "name":"Sender Alex",\n      "email":"senderalex@example.com"\n   },\n   "to":[  \n      {  \n         "email":"testmail@example.com",\n         "name":"John Doe"\n      }\n   ],\n   "subject":"Hello world",\n   "htmlContent":"<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Brevo.</p></body></html>"\n}',
        body: JSON.stringify({
            'sender': {
                'name': TEST_BUSINESS_NAME,
                'email': TEST_FROM_EMAIL
            },
            'to': [
                {
                    'email': customer_email,
                    'name': customer_name
                }
            ],
            'subject': 'Invoice Due Reminder',
            'htmlContent': `<html><head></head><body><p>Dear ${customer_name},</p>
The invoice ${invoice_number} of Kshs. ${total_amount_due} is due on ${due_date}
.</p></body></html>`
        })
    }).then((res) => {
        console.log('Successful.Email Sent  to ', customer_email, 'Done')
    }).catch((err) => {
        console.log(
            'Error Occured', err
        )
    })
}

export default sendNotification;