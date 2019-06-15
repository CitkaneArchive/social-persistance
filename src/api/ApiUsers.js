/* eslint-disable prefer-promise-reject-errors */

const Api = require('../../../social-deployment/templates/nodejs/api/Api');
const utils = require('../utils/userUtils');

const initialPayload = {
    '83denmejwpcycse': {
        userName: 'admin',
        realName: 'Admin User',
        about: 'The initial admin user',
        uid: '83denmejwpcycse'
    }
};

class ApiUsers extends Api {
    constructor(sockets) {
        super(sockets, 'users', initialPayload);
    }

    async saveUser(user, ownerId = null) {
        const { userName } = user;
        const { users } = this.cache;
        try {
            if (!userName) return this.reject(400, 'Username is required');
            const duplicateUserName = utils.getUserByName(users, userName);
            if (!duplicateUserName) {
                users[user.uid] = user;
                await this.save(users);
                this.cache.users[user.uid] = user;
                return this.resolve(201, user);
            }
            return this.reject(409, 'Username already exists');
        } catch (err) {
            console.log(err);
            return this.reject(500, err.message);
        }
    }

    getAllUsers(ownerId = null) {
        const { users } = this.cache;
        return this.resolve(200, users);
    }

    getUserById(uid, ownerId = null) {
        const { users } = this.cache;
        if (users[uid]) return this.resolve(200, users[uid]);
        return this.reject(404, 'Could not find user');
    }

    async getUserByName(userName, ownerId = null) {
        const { users } = this.cache;
        const user = utils.getUserByName(users, userName);
        if (user) return this.resolve(200, user);
        return this.reject(404, 'Could not find user');
    }

    async updateUser(user, ownerId = null) {
        const { uid, userName } = user;
        const { users } = this.cache;
        if (!userName) return this.reject(400, 'Username is required');
        if (!users[uid]) return this.reject(404, 'Could not find user');
        const unmodifiedUser = { ...users[uid] };
        try {
            const duplicateUserName = utils.getUserByName(users, userName);
            if (!duplicateUserName || duplicateUserName.uid === uid) {
                Object.keys(user).forEach((key) => {
                    users[uid][key] = user[key];
                });
                await this.save(users);
                return this.resolve(200, users[uid]);
            }
            return this.reject(403, 'Username already exists');
        } catch (err) {
            users[uid] = unmodifiedUser;
            console.log(err);
            return this.reject(500, err.message);
        }
    }

    async deleteUser(user, ownerId = null) {
        const { uid } = user;
        const { users } = this.cache;
        delete users[uid];
        try {
            await this.save(users);
            return this.resolve(205, user);
        } catch (err) {
            users[uid] = user;
            return this.reject(500, err.message);
        }
    }
}

module.exports = ApiUsers;
