/** @module persistance */

const path = require('path');
// eslint-disable-next-line no-underscore-dangle
global.__rootDir = path.join(__dirname, '../');
const Sockets = require('./templates/Sockets');
const BaseApi = require('./templates/BaseApi');
const ApiUsers = require('./api/ApiPersistUsers');
const ApiActivities = require('./api/ApiPersistActivities');

const sockets = new Sockets('persistance');
const { api } = new BaseApi(sockets);
const user = new ApiUsers(sockets, api);
const activity = new ApiActivities(sockets, api);

const apiInterface = {
    /**
     * @interface
     * @memberof module:persistance
     * @example <caption>Called from external microservice</caption>
     * api.create('persistance.<method>', parameter || [parameters], {@link ownerId})
     * */
    create: {
        /**
         * Saves a new user to persistant storage
         * @method module:persistance.create#user
         * @param {request} request - the standard request wrapper
         * @param {user} request.params -The user object
         * @param {String} request.params.userName -A unique user name.
         * @param {String} [request.params.realName] -The user's real name.
         * @param {String} [request.params.about] -About text for the user.
         * @param {String} request.params.uid -The unique id for the user.
         * @param {String} request.params.created -The ISO date string of when the user was created.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.create('persistance.user', {@link user}, {@link ownerId});
         * @returns {(response|response-error)} 201:{@link user}
         * */
        user: request => user.saveUser(request.args[0], request.ownerId),
        /**
         * Saves a new activity to persistant storage
         * @method module:persistance.create#activity
         * @param {request} request - the standard request wrapper
         * @param {activity} request.params -The activity object
         * @param {String} request.params.title - The activity title.
         * @param {String} request.params.about - The text about the activity.
         * @param {String} request.params.date - The date that is pproposed for the activity in 'Year-Month-Day'.
         * @param {String} request.params.ownerId -The uid of the person entity who created the activity.
         * @param {String} request.params.created -The ISO date string of when the activity was created.
         * @param {String} request.params.uid -The unique id for the activity.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.create('persistance.activity', {@link activity}, {@link ownerId});
         * @returns {(response|response-error)} 201:{@link activity}
         * */
        activity: request => activity.saveActivity(request.args[0], request.ownerId)
    },
    /**
     * @interface
     * @memberof module:persistance
     * @example <caption>Called from external microservice</caption>
     * api.read('persistance.<method>', parameter || [parameters], {@link ownerId})
     * */
    read: {
        /**
         * Retrieves all users
         * @method module:persistance.read#users
         * @param {request} request - the standard request wrapper
         * @param {Object[]} request.params - an empty array
         * @param {ownerId} ownerId -The uid of the entity making the call.
         * @example {@link module:api}.read('persistance.users', [], {@link ownerId});
         * @returns {(response|response-error)} 200:{@link module:persistance~users} - an object of {@link user}s indexed by their uid.
         * */
        users: request => user.getAllUsers(request.ownerId),
        /**
         * Retrieves an user by uid
         * @method module:persistance.read#user
         * @param {request} request - the standard request wrapper
         * @param {string} request.params - The uid of the user.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.read('persistance.user', 'user123', {@link ownerId});
         * @returns {(response|response-error)} 200:{@link user}.
         * */
        user: request => user.getUserById(request.args[0], request.ownerId),
        /**
         * Retrieves an user by username
         * @method module:persistance.read#userByName
         * @param {request} request - the standard request wrapper
         * @param {string} request.userName - The uid of the user.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.read('persistance.userByName', 'fred', {@link ownerId});
         * @returns {(response|response-error)} 200:{@link user}.
         * */
        userByName: request => user.getUserByName(request.args[0], request.ownerId),
        /**
         * Retrieves all activities
         * @method module:persistance.read#activities
         * @param {request} request - the standard request wrapper
         * @param {Object[]} request.params - an empty array
         * @param {ownerId} ownerId -The uid of the entity making the call.
         * @example {@link module:api}.read('persistance.activities', [], {@link ownerId});
         * @returns {(response|response-error)} 200:{@link module:persistance~activities} - an object of {@link activitie}s indexed by their uid.
         * */
        activities: request => activity.getAllActivities(request.ownerId),
        /**
         * Retrieves an activity by uid
         * @method module:persistance.read#activity
         * @param {request} request - the standard request wrapper
         * @param {string} request.params - The uid of the activity.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.read('persistance.activity', 'activity123', {@link ownerId});
         * @returns {(response|response-error)} 200:{@link activity}.
         * */
        activity: request => activity.getActivityById(request.args[0], request.ownerId)
    },
    /**
     * @interface
     * @memberof module:persistance
     * @example <caption>Called from external microservice</caption>
     * api.update('persistance.<method>', parameter || [parameters], {@link ownerId})
     * */
    update: {
        /**
         * Updates a user to persistant storage
         * @method module:persistance.update#user
         * @param {request} request - the standard request wrapper
         * @param {user} request.params -The user object
         * @param {String} request.params.userName -A unique user name.
         * @param {String} [request.params.realName] -The user's real name.
         * @param {String} [request.params.about] -About text for the user.
         * @param {String} request.params.uid -The unique id for the user.
         * @param {String} [request.params.created] -The ISO date string of when the user was created.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.update('persistance.user', {@link user}, {@link ownerId});
         * @returns {(response|response-error)} 200:{@link user} - the updated user
         * */
        user: request => user.updateUser(request.args[0], request.ownerId),
        /**
         * Updates an activity to persistant storage
         * @method module:persistance.update#activity
         * @param {request} request - the standard request wrapper
         * @param {activity} request.params -The activity object
         * @param {String} [request.params.title] - The activity title.
         * @param {String} [request.params.about] - The text about the activity.
         * @param {String} [request.params.date] - The date that is pproposed for the activity in 'Year-Month-Day'.
         * @param {String} [request.params.ownerId] -The uid of the person entity who created the activity.
         * @param {String} [request.params.created] -The ISO date string of when the activity was created.
         * @param {String} request.params.uid -The unique id for the activity.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.update('persistance.activity', {@link activity}, {@link ownerId});
         * @returns {(response|response-error)} 200:{@link activity}
         * */
        activity: request => activity.updateActivity(request.args[0], request.ownerId)
    },
    /**
     * @interface
     * @memberof module:persistance
     * @example <caption>Called from external microservice</caption>
     * api.delete('persistance.<method>', parameter || [parameters], {@link ownerId})
     * */
    delete: {
        /**
         * Deletes a user from persistant storage
         * @method module:persistance.delete#user
         * @param {request} request - the standard request wrapper
         * @param {user} request.params -The user object
         * @param {String} [request.params.userName] -A unique user name.
         * @param {String} [request.params.realName] -The user's real name.
         * @param {String} [request.params.about] -About text for the user.
         * @param {String} request.params.uid -The unique id for the user.
         * @param {String} [request.params.created] -The ISO date string of when the user was created.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.delete('persistance.user', {@link user}, {@link ownerId});
         * @returns {(response|response-error)} 205:{@link user} - the supplied user object
         * */
        user: request => user.deleteUser(request.args[0], request.ownerId),
        /**
         * Deletes an activity from persistant storage
         * @method module:persistance.delete#activity
         * @param {request} request - the standard request wrapper
         * @param {activity} request.params -The activity object
         * @param {String} [request.params.title] - The activity title.
         * @param {String} [request.params.about] - The text about the activity.
         * @param {String} [request.params.date] - The date that is pproposed for the activity in 'Year-Month-Day'.
         * @param {String} [request.params.ownerId] -The uid of the person entity who created the activity.
         * @param {String} [request.params.created] -The ISO date string of when the activity was created.
         * @param {String} request.params.uid -The unique id for the activity.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.delete('persistance.activity', {@link activity}, {@link ownerId});
         * @returns {(response|response-error)} 205:{@link activity} - the supplied activity object
         * */
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
