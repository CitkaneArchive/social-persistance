function getUserByName(users, userName) {
    const user = Object.keys(users).find(uid => users[uid].userName === userName);
    if (!user) return false;
    return users[user];
}

module.exports = {
    getUserByName
};
