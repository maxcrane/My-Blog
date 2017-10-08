// This module does two things
//
// 1. if the environment variable NODE_ENV is not equal to 'production', it will
// load an environment file to the current running environment
//
// 2. exposes the path to the env file it loaded via the pathToEnv function
// (path will be undefined if an env file was not loaded)

let pathToEnv = undefined;

if (process.env.NODE_ENV !== 'production') {
    const path = require('path');

    const envs = {
        'development' : path.resolve(__dirname, "..", "..", "..", ".devenv"),
        'productionlocal' :path.resolve(__dirname, "..", "..", "..", ".env")
    };

    pathToEnv = envs[process.env.NODE_ENV];

    if (pathToEnv) {
        console.log(`Loading to environment from environment file at ${pathToEnv}`);
        require('dotenv').config({path: pathToEnv})
    }
}

module.exports =  {
    pathToEnv: () => {
        return pathToEnv;
    }
};