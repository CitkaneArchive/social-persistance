/* eslint-disable import/no-extraneous-dependencies */
const { MessageProviderPact } = require('@pact-foundation/pact');
const fs = require('fs-extra');
const config = require('config');
const { expect } = require('chai');
const {
    user,
    activity,
    apiInterface,
    gracefulShutdown
} = require('../../src/persistance');
const { version } = require('../../package.json');

const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';
let pact;

describe('persistance consumer expectations', () => {
    before(() => {
        pact = new MessageProviderPact({
            messageProviders: {
                'persistance.create.user': async (message) => {
                    const request = message.providerStates[0].name;
                    try {
                        const response = await apiInterface.create.user(request);
                        return response;
                    } catch (err) {
                        throw err;
                    }
                }
            },
            logLevel: LOG_LEVEL,
            provider: 'social-persistance',
            providerVersion: version,
            /*
            pactUrls: [
                path.join(__dirname, '../../../social-users/tests/pacts/social-users-social-persistance.json')
            ],
            */
            pactBrokerUrl: config.get('network').pacts,
            publishVerificationResult: true
            // consumerVersionTag: version
        });
    });

    after(() => {
        fs.removeSync(user.storePath);
        fs.removeSync(activity.storePath);
        setTimeout(() => {
            gracefulShutdown();
        }, 1000);
    });

    it('is running in test environment', () => {
        expect(process.env.NODE_ENV).to.equal('test');
    });

    it('fulfills consumer requirement contracts', () => pact.verify());
});
