/** @module persistance */

const path = require('path');
// eslint-disable-next-line no-underscore-dangle
global.__rootDir = path.join(__dirname, '../');
const Sockets = require('./templates/Sockets');
const ApiUsers = require('./api/ApiPersistUsers');
const ApiActivities = require('./api/ApiPersistActivities');

const sockets = new Sockets('persistance');
const user = new ApiUsers(sockets);
const activity = new ApiActivities(sockets);

const apiInterface = {
    /**
     * Create for CRUD operations
     * @namespace module:persistance.create
     * @example api.create('persistance.<method>', parameter || [parameters], {@link ownerId})
     * */
    create: {
        /**
         * Saves a new user to persistant storage
         * @method module:persistance.create#user
         * @param {user} user -The user object
         * @param {String} user.userName -A unique user name.
         * @param {String} [user.realName] -The user's real name.
         * @param {String} [user.about] -About text for the user.
         * @param {String} user.uid -The unique id for the user.
         * @param {String} user.created -The ISO date string of when the user was created.
         * @param {ownerId} ownerId -The uid of the entity making the call.
         * @example api.create('persistance.user', {@link user}, {@link ownerId});
         * @returns {response} An api response wrapper with a {@link user} object if successful;
         * */
        user: request => user.saveUser(request.args[0], request.ownerId),
        /**
         * Saves a new activity to persistant storage
         * @method module:persistance.create#activity
         * @param {activity} activity -The activity object
         * @param {String} activity.title - The activity title.
         * @param {String} activity.about - The text about the activity.
         * @param {String} activity.date - The date that is pproposed for the activity in 'Year-Month-Day'.
         * @param {String} activity.ownerId -The uid of the person entity who created the activity.
         * @param {String} activity.created -The ISO date string of when the activity was created.
         * @param {String} activity.uid -The unique id for the activity.
         * @param {ownerId} ownerId -The uid of the entity making the call.
         * @example api.create('persistance.activity', {@link activity}, {@link ownerId});
         * @returns {response} An api response wrapper with a {@link activity} object if successful;
         * */
        activity: request => activity.saveActivity(request.args[0], request.ownerId)
    },
    /**
     * Read for CRUD operations
     * @namespace module:persistance.read
     * */
    read: {
        users: request => user.getAllUsers(request.ownerId),
        user: request => user.getUserById(request.args[0], request.ownerId),
        userByName: request => user.getUserByName(request.args[0], request.ownerId),

        activities: request => activity.getAllActivities(request.ownerId),
        activity: request => activity.getActivityById(request.args[0], request.ownerId)
    },
    /**
     * Update for CRUD operations
     * @namespace module:persistance.update
     * */
    update: {
        user: request => user.updateUser(request.args[0], request.ownerId),

        activity: request => activity.updateActivity(request.args[0], request.ownerId)
    },
    /**
     * Delete for CRUD operations
     * @namespace module:persistance.delete
     * */
    delete: {
        user: request => user.deleteUser(request.args[0], request.ownerId),

        activity: request => activity.deleteActivity(request.args[0], request.ownerId)
    }
};

sockets.makeResponder(apiInterface);

function gracefulShutdown() {
    console.log('Gracefully shutting down social-users');
    process.exit();
}
module.exports = {
    user,
    activity,
    apiInterface,
    gracefulShutdown
};
