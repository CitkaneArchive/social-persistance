/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* global __rootDir */

const fs = require('fs-extra');
const path = require('path');
const BaseApi = require('../../../social-deployment/templates/nodejs/api/BaseApi');

const storePath = path.join(__rootDir, 'store');
const userStorePath = path.join(storePath, 'users');
const userStore = path.join(userStorePath, 'users.json');
const cache = {};

fs.ensureDirSync(storePath);
fs.ensureDirSync(userStorePath);
if (!fs.existsSync(userStore)) {
    fs.writeJsonSync(userStore, {
        '83denmejwpcycse': {
            userName: 'admin',
            realName: 'Admin User',
            about: 'The initial admin user',
            uid: '83denmejwpcycse'
        }
    }, { spaces: 4 });
}
cache.users = fs.readJsonSync(userStore);

function save(location, payload) {
    return fs.writeJson(location, payload, { spaces: 4 });
}

class Api extends BaseApi {
    constructor(sockets) {
        super(sockets);
        this.ownerId = null;
    }

    async saveUser(user, ownerId = null) {
        const { userName } = user;
        const { users } = cache;
        if (!userName) return Promise.reject({ status: 403, message: 'Username is required' });
        try {
            const duplicateUserName = this.userByName(userName);
            if (!duplicateUserName) {
                users[user.uid] = user;
                await save(userStore, users);
                cache.users[user.uid] = user;
                return Promise.resolve(user);
            }
            return Promise.reject({ status: 403, message: 'Username already exists' });
        } catch (err) {
            console.log(err);
            return Promise.reject({ status: 500, message: 'Could not save user' });
        }
    }

    getAllUsers(ownerId = null) {
        const { users } = cache;
        return Promise.resolve(users);
    }

    getUserById(uid, ownerId = null) {
        const { users } = cache;
        if (users[uid]) return Promise.resolve(users[uid]);
        return Promise.reject({ status: 404, message: 'Could not find user' });
    }

    userByName(userName) {
        const { users } = cache;
        const user = Object.keys(users).find(uid => users[uid].userName === userName);
        if (!user) return false;
        return users[user];
    }

    async getUserByName(userName, ownerId = null) {
        const user = this.userByName(userName);
        if (user) return Promise.resolve(user);
        return Promise.reject({ status: 404, message: 'Could not find user' });
    }

    async updateUser(user, ownerId = null) {
        const { uid, userName } = user;
        const { users } = cache;
        if (!userName) return Promise.reject({ status: 403, message: 'Username is required' });
        if (!users[uid]) return Promise.reject({ status: 404, message: 'Could not find user' });
        try {
            const duplicateUserName = this.userByName(userName);
            if (!duplicateUserName || duplicateUserName.uid === uid) {
                Object.keys(user).forEach((key) => {
                    users[uid][key] = user[key];
                });
                await save(userStore, users);
                return Promise.resolve(users[uid]);
            }
            return Promise.reject({ status: 403, message: 'Username already exists' });
        } catch (err) {
            console.log(err);
            return Promise.reject({ status: 500, message: 'Could not update user' });
        }
    }

    async deleteUser(user, ownerId = null) {
        const { uid } = user;
        const { users } = cache;
        delete users[uid];
        try {
            await save(userStore, users);
            return Promise.resolve(user);
        } catch (err) {
            users[uid] = user;
            return Promise.reject({ status: 500, message: 'Could not delete user' });
        }
    }
}

module.exports = Api;
