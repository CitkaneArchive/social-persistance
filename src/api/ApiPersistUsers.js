/* eslint-disable no-unused-vars */

const Api = require('../templates/Api');
const utils = require('../utils/userUtils');

let api;

const initialPayload = {
    '83denmejwpcycse': {
        userName: 'admin',
        realName: 'Admin User',
        about: 'The initial admin user',
        uid: '83denmejwpcycse',
        created: new Date(Date.now()).toISOString()
    }
};

/** @memberof module:persistance */
class ApiPersistUsers extends Api {
    /**
     * @classdesc Utilities to persist and retrieve users
     * @param {sockets} sockets -The zmq socket class instance.
     */
    constructor(sockets, baseApi) {
        super(sockets, 'users', initialPayload);
        api = baseApi;
    }

    async saveUser(user, ownerId = null) {
        const { userName } = user;
        const { users } = this.cache;
        const update = { ...users };
        try {
            if (!userName) return api.reject(400, 'Username is required');
            const duplicateUserName = utils.getUserByName(users, userName);
            if (!duplicateUserName) {
                update[user.uid] = user;
                await this.save(update);
                this.cache.users = update;
                return api.resolve(201, this.cache.users[user.uid]);
            }
            return this.reject(409, 'Username already exists');
        } catch (err) {
            console.log(err);
            return api.reject(500, err.message);
        }
    }

    getAllUsers(ownerId = null) {
        const { users } = this.cache;
        return api.resolve(200, users);
    }

    getUserById(uid, ownerId = null) {
        const { users } = this.cache;
        if (users[uid]) return api.resolve(200, users[uid]);
        return api.reject(404, 'Could not find user');
    }

    async getUserByName(userName, ownerId = null) {
        const { users } = this.cache;
        const user = utils.getUserByName(users, userName);
        if (user) return api.resolve(200, user);
        return api.reject(404, 'Could not find user');
    }

    async updateUser(user, ownerId = null) {
        const { uid, userName } = user;
        const { users } = this.cache;
        const update = { ...users };
        if (!userName) return api.reject(400, 'Username is required');
        if (!uid) return api.reject(400, 'User uid is required');
        if (!users[uid]) return api.reject(404, 'Could not find user');
        try {
            const duplicateUserName = utils.getUserByName(users, userName);
            if (!duplicateUserName || duplicateUserName.uid === uid) {
                Object.keys(user).forEach((key) => {
                    if (key !== 'uid') update[uid][key] = user[key];
                });
                await this.save(update);
                this.cache.users = update;
                return api.resolve(200, this.cache.users[uid]);
            }
            return this.reject(403, 'Username already exists');
        } catch (err) {
            console.log(err);
            return api.reject(500, err.message);
        }
    }

    async deleteUser(user, ownerId = null) {
        const { uid } = user;
        const { users } = this.cache;
        const update = { ...users };
        delete update[uid];
        try {
            await this.save(update);
            this.cache.users = update;
            return api.resolve(205, user);
        } catch (err) {
            console.log(err);
            return api.reject(500, err.message);
        }
    }
}

module.exports = ApiPersistUsers;
