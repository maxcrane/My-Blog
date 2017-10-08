const firebase = require("firebase");

if (process.env.NODE_ENV !== 'production') {
    const path = require('path');
    const envs = {
        'development' : path.resolve(__dirname, "..", "..", "..", ".devenv"),
        'productionlocal' :path.resolve(__dirname, "..", "..", "..", "env")
    };
    require('dotenv').config({path: envs[process.env.NODE_ENV]})
}

firebase.initializeApp({
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId
});

module.exports = {
    getFirebase: function () {
        return firebase;
    }
};
