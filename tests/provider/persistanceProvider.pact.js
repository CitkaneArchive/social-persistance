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
const pacts = config.get('pacts');

function makePact(messageProviders) {
    return new MessageProviderPact({
        messageProviders,
        logLevel: LOG_LEVEL,
        provider: 'social-persistance',
        providerVersion: version,
        pactBrokerUrl: `${pacts.broker}:${pacts.brokerPort}`,
        publishVerificationResult: true
    });
}
describe('ENVIRONMENT', () => {
    it('is running in test environment', () => {
        expect(process.env.NODE_ENV).to.equal('test');
    });
});
describe('persistance consumer expectations', () => {
    const messageProviders = {};
    after(() => {
        fs.removeSync(user.storePath);
        fs.removeSync(activity.storePath);
        gracefulShutdown();
    });

    describe('add consumer requirement contracts to pact', () => {
        it('persists a new user', () => {
            messageProviders['persistance.create.user'] = async (message) => {
                const request = message.providerStates[0].name;
                try {
                    return await apiInterface.create.user(request);
                } catch (err) {
                    return err;
                }
            };
        });
        it('persists a new activity', () => {
            messageProviders['persistance.create.activity'] = async (message) => {
                const request = message.providerStates[0].name;
                try {
                    return await apiInterface.create.activity(request);
                } catch (err) {
                    return err;
                }
            };
        });
    });
    describe('fulfill all contract requirements', () => {
        it('verify against broker', async () => {
            try {
                return await makePact(messageProviders).verify();
            } catch (err) {
                return err;
            }
        });
    });
});
