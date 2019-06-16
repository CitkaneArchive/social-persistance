const path = require('path');
// eslint-disable-next-line no-underscore-dangle
global.__rootDir = path.join(__dirname, '../');
const Sockets = require('../../social-deployment/templates/nodejs/api/Sockets');
const ApiUsers = require('./api/ApiPersistUsers');
const ApiActivities = require('./api/ApiPersistActivities');

const sockets = new Sockets('persistance');
const user = new ApiUsers(sockets);
const activity = new ApiActivities(sockets);

const apiInterface = {
    create: {
        user: request => user.saveUser(request.args[0], request.ownerId),

        activity: request => activity.saveActivity(request.args[0], request.ownerId)
    },
    read: {
        users: request => user.getAllUsers(request.ownerId),
        user: request => user.getUserById(request.args[0], request.ownerId),
        userByName: request => user.getUserByName(request.args[0], request.ownerId),

        activities: request => activity.getAllActivities(request.ownerId),
        activity: request => activity.getActivityById(request.args[0], request.ownerId)
    },
    update: {
        user: request => user.updateUser(request.args[0], request.ownerId),

        activity: request => activity.updateActivity(request.args[0], request.ownerId)
    },
    delete: {
        user: request => user.deleteUser(request.args[0], request.ownerId),

        activity: request => activity.deleteActivity(request.args[0], request.ownerId)
    }
};

sockets.makeResponder(apiInterface);
