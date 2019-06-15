/* eslint-disable no-unused-vars */

const Api = require('../../../social-deployment/templates/nodejs/api/Api');

class ApiPersistActivities extends Api {
    constructor(sockets) {
        super(sockets, 'activities');
    }

    async saveActivity(activity, ownerId = null) {
        const { activities } = this.cache;
        try {
            if (!activity.uid) return this.reject(400, 'Activity uid is required');
            await this.save(activity);
            activities[activity.uid] = activity;
            return this.resolve(201, activity);
        } catch (err) {
            console.log(err);
            return this.reject(500, err.message);
        }
    }

    getAllActivities(ownerId = null) {
        const { activities } = this.cache;
        return this.resolve(200, activities);
    }
}

module.exports = ApiPersistActivities;
