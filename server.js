const express = require('express');
const bodyParser = require('body-parser');
const { parseStringPromise, Builder } = require('xml2js');

const app = express();
const port = 3004;

// Middleware to parse XML request body
app.use(bodyParser.text({ type: 'application/xml' }));

// Helper function to build XML response
const buildXmlResponse = (responseObject) => {
    const builder = new Builder({ headless: true });
    return builder.buildObject(responseObject);
};

// Existing endpoint for GIPTransaction
app.post('/ned', async (req, res) => {
    try {
        const jsonRequest = await parseStringPromise(req.body, { explicitArray: false });
        console.log('Received GIPTransaction Request:', JSON.stringify(jsonRequest, null, 2));

        const transaction = jsonRequest['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction'];
        const { Amount, datetime, TrackingNum, FunctionCode, OrigineBank, DestBank, SessionID, ChannelCode, AccountToCredit, Narration } = transaction;

        const responseObject = {
            'soapenv:Body': {
                'com:GIPTransaction': {
                    'ReqGIPTransaction': {
                        Amount,
                        datetime,
                        TrackingNum,
                        FunctionCode: FunctionCode === '230' ? '231' : FunctionCode,
                        OrigineBank,
                        DestBank,
                        SessionID,
                        ChannelCode,
                        NameToDebit: 'IMAD',
                        AccountToCredit,
                        Narration,
                        ActCode: '000',
                        AprvCode: '000000',
                    },
                },
            },
        };

        const xmlResponse = buildXmlResponse(responseObject);
        console.log('Generated GIPTransaction Response:', xmlResponse);

        res.set('Content-Type', 'application/xml');
        res.send(xmlResponse);
    } catch (error) {
        console.error('Error processing GIPTransaction request:', error);
        res.status(500).send('<error>Internal Server Error</error>');
    }
});

// New endpoint for FTC
app.post('/ftc', async (req, res) => {
    try {
        const jsonRequest = await parseStringPromise(req.body, { explicitArray: false });
        console.log('Received FTC Request:', JSON.stringify(jsonRequest, null, 2));

        const transaction = jsonRequest['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction'];
        const { Amount, datetime, TrackingNum, FunctionCode, OrigineBank, DestBank, SessionID, ChannelCode, AccountToCredit, Narration } = transaction;

        const responseObject = {
            'soapenv:Body': {
                'com:GIPTransaction': {
                    'ReqGIPTransaction': {
                        Amount,
                        datetime,
                        TrackingNum,
                        FunctionCode,
                        OrigineBank,
                        DestBank,
                        SessionID,
                        ChannelCode,
                        NameToDebit: 'IMAD',
                        AccountToCredit,
                        Narration,
                        ActCode: '000',
                        AprvCode: '000000',
                    },
                },
            },
        };

        const xmlResponse = buildXmlResponse(responseObject);
        console.log('Generated FTC Response:', xmlResponse);

        res.set('Content-Type', 'application/xml');
        res.send(xmlResponse);
    } catch (error) {
        console.error('Error processing FTC request:', error);
        res.status(500).send('<error>Internal Server Error</error>');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
