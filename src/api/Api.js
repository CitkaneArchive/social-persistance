/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* global __rootDir */

const fs = require('fs-extra');
const path = require('path');
const BaseApi = require('@social/social-deployment/templates/nodejs/api/BaseApi');

const storePath = path.join(__rootDir, 'store');
const userStorePath = path.join(storePath, 'users');
const userStore = path.join(userStorePath, 'users.json');

fs.ensureDirSync(storePath);
fs.ensureDirSync(userStorePath);
if (!fs.existsSync(userStore)) fs.writeJsonSync(userStore, {}, { spaces: 4 });

class Api extends BaseApi {
    constructor(sockets) {
        super(sockets);
        this.ownerId = null;
    }

    saveUser(user, ownerId = null) {
        const users = fs.readJsonSync(userStore);
        users[user.uid] = user;
        fs.writeJsonSync(userStore, users, { spaces: 4 });
        return Promise.resolve(user);
    }
}

module.exports = Api;
