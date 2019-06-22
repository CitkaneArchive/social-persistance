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
const pactBrokerUrl = `${pacts.broker}:${pacts.brokerPort}`;

function makePact(messageProviders) {
    return new MessageProviderPact({
        messageProviders,
        logLevel: LOG_LEVEL,
        provider: 'social-persistance',
        providerVersion: version,
        pactBrokerUrl,
        publishVerificationResult: true
    });
}
after(() => {
    fs.removeSync(user.storePath);
    fs.removeSync(activity.storePath);
    setTimeout(() => { gracefulShutdown(); }, 1000);
});

describe('ENVIRONMENT', () => {
    it('is running in test environment', () => {
        expect(process.env.NODE_ENV).to.equal('test');
    });
});
describe('persistance consumer expectations', () => {
    const messageProviders = {};


    describe('add consumer requirement contracts to pact', () => {
        it('create.user', () => {
            messageProviders['persistance.create.user'] = async (message) => {
                const request = message.providerStates[0].name;
                try {
                    return await apiInterface.create.user(request);
                } catch (err) {
                    return err;
                }
            };
        });
        it('create.activity', () => {
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
        it('verify against broker', () => makePact(messageProviders).verify());
    });
});
