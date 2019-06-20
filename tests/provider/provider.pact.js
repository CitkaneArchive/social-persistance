const { MessageProviderPact } = require('@pact-foundation/pact');
const config = require('config');
const path = require('path');
const types = require('../../src/definitions/typeDefinitions');

const newIsoDate = new Date(Date.now()).toISOString();
const apiInterface = require('../../src/persistance');

const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';

describe('persistance provider tests', () => {
    const pact = new MessageProviderPact({
        messageProviders: {
            'persistance.create.user': async (message) => {
                const request = message.providerStates[0].name;
                try {
                    const response = await apiInterface.create.user(request);
                    console.log(response);
                    return response;
                } catch (err) {
                    console.log(err);
                    return err;
                }
            }
        },
        logLevel: LOG_LEVEL,
        provider: 'social-persistance',
        providerVersion: '0.0.0',
        pactUrls: [
            path.join(__dirname, '../../../social-users/tests/pacts/social-users-social-persistance.json')
        ],
        // pactBrokerUrl: config.get('network').pacts,
        // publishVerificationResult: true,
        consumerVersionTag: '0.0.0'
    });

    describe('runs a test', () => {
        it('does something', () => {
            return pact.verify();
        });
    });
});
