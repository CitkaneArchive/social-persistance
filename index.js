/* eslint-disable prefer-promise-reject-errors */
// eslint-disable-next-line no-underscore-dangle
global.__rootDir = __dirname;
const Sockets = require('../social-deployment/templates/nodejs/api/Sockets');
const Api = require('./src/api/Api');

const sockets = new Sockets('persistance');
const api = new Api(sockets);

const apiInterface = {
    create: {
        user: request => api.saveUser(request.args[0], request.ownerId)
            .then(payload => ({ status: 201, payload }))
    },
    read: {
        users: request => api.getAllUsers(request.ownerId)
            .then(payload => ({ status: 200, payload })),

        user: request => api.getUserById(request.args[0], request.ownerId)
            .then(payload => ({ status: 200, payload })),

        userByName: request => api.getUserByName(request.args[0], request.ownerId)
            .then(payload => ({ status: 200, payload }))
    },
    update: {
        user: request => api.updateUser(request.args[0], request.ownerId)
            .then(payload => ({ status: 200, payload }))
    },
    delete: {
        user: request => api.deleteUser(request.args[0], request.ownerId)
            .then(payload => ({ status: 200, payload }))
    }
};

sockets.makeResponder(apiInterface);
