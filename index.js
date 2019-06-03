/* eslint-disable prefer-promise-reject-errors */
// eslint-disable-next-line no-underscore-dangle
global.__rootDir = __dirname;
const Sockets = require('@social/social-deployment/templates/nodejs/api/Sockets');
const Api = require('./src/api/Api');

const sockets = new Sockets('persistance');
const api = new Api(sockets);

const apiInterface = {
    create: {
        saveUser: request => api.saveUser(request.args[0], request.ownerId)
            .then(payload => ({ status: 201, payload }))
    },
    read: {},
    update: {},
    delete: {}
};

sockets.makeResponder(apiInterface);
