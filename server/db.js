/**
 * Created by pablo on 02.04.16.
 */
const log = require('bole')('db.adapter')
const pgBricks = require('pg-bricks');

exports.register = function (server, options, next) {
    function  makeConString(options){
        const conString = `postgres://${options.login}:${options.password}@${options.host}/${options.database}`;
        return conString;
    }
    var conString = makeConString(options);
    var db = pgBricks.configure(conString);

    server.decorate('request', 'db', db)
    server.app.db = db
    next()
}

exports.register.attributes = {
    name: 'db',
    version: '0.0.1',
}