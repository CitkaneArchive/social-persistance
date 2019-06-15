/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-promise-reject-errors */

const config = require('config');

global.__network = config.get('network');
global.__rootDir = __dirname;

const Sockets = require('../social-deployment/templates/nodejs/api/Sockets');

const sockets = new Sockets('persistance');
const ApiUsers = require('./src/api/ApiUsers');
const ApiActivities = require('./src/api/ApiActivities');


const userApi = new ApiUsers(sockets);
const activityApi = new ApiActivities(sockets);

const apiInterface = {
    create: {
        user: request => userApi.saveUser(request.args[0], request.ownerId),
        activity: request => activityApi.saveActivity(request.args[0], request.ownerId)
    },
    read: {
        users: request => userApi.getAllUsers(request.ownerId),
        user: request => userApi.getUserById(request.args[0], request.ownerId),
        userByName: request => userApi.getUserByName(request.args[0], request.ownerId)
    },
    update: {
        user: request => userApi.updateUser(request.args[0], request.ownerId)
    },
    delete: {
        user: request => userApi.deleteUser(request.args[0], request.ownerId)
    }
};

sockets.makeResponder(apiInterface);
