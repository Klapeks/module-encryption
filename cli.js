#!/usr/bin/env node

"use strict";

/** @param {string[]} args  */
function init(args) {
    if (args[0].endsWith('node')) {
        args = args.slice(1);
    }
    if (args.includes('--secret')) {
        const i = args.indexOf('--secret')
        process.env.MODULE_ENCRYPTION_SECRET = args[i+1];
        args[i] = args[i+1] = undefined;
    }
    args = args.filter(Boolean);


    if (args[0].endsWith('encrypt-folder') || args[0].endsWith('encrypt-module')) {
        var index = require('./dist/index');
        index.encrypt(args[1] || './dist', args[2] || '.');
        return;
    }
    if (args[0].endsWith('decrypt-folder') || args[0].endsWith('encrypt-module')) {
        var index = require('./dist/index');
        index.decrypt(args[1] || '.', args[2] || './lib');
        return;
    }

    
    if (args[0].endsWith('module-encryption')) {
        if (args[1] === 'cwd') {
            console.log(process.cwd())
            return;
        }
        if (args[1] === 'secret') {
            var index = require('./dist/index');
            console.log(index.config.secret());
            return;
        }
        console.log("??")
        return;
    }
    throw new Error("?? cli not found??", args);
}
init(process.argv);
