'use strict';

const Glue = require('glue'),
    bole = require('bole'),
    nconf = require('nconf'),
    Path = require('path'),
    Bluebird = require('bluebird')
const stream = require('stream');
const arangojs = require('arangojs');
var ar = new arangojs.Database();
var logCollection = ar.collection('logs');
logCollection.create()

class DbStream extends stream.Writable {
    _write(chunk, enc, next) {
        var rec = JSON.parse(chunk.toString());
        //console.log(rec);
        logCollection.save(rec)
            .then(info => {
                
            }, err => console.error(err.stack));
        next();
    }
}
var dbStream = new DbStream()
bole.output({
    level: 'info',
    stream: dbStream,
})
const log = bole('index')

nconf.argv()
    .env()
    .file({file: 'config/server.json'})
    .defaults({
        port: 8080,
        NODE_ENV: 'dev',
    })
log.info('start', nconf.get('port'))

const server = {
    debug: {log: ['hapi', 'error'], request: ['error', 'hapi']},
    connections: {
        routes: {
            timeout: {
                server: 10 * 1000,
            },
        },
    },
};
const connections = [
    {
        port: nconf.get('port'),
        labels: ['api', 'public'],
        routes: {
            files: {relativeTo: Path.join(__dirname, '/public')},
        },
    },
];
const registrations = [
    {plugin: {register: 'inert', options: null}},
    {plugin: {register: 'nes', options: {auth: false}}},
    {plugin: {register: './server/db', options: nconf.get('db')}},
    {plugin: {register: './server/routes', options: null}},
    {plugin: {register: 'blipp', options: null}},
];

var options = {
    relativeTo: __dirname
};

const manifest = {
    connections,
    server,
    registrations
};

module.exports = new Bluebird(function (resolve, reject) {
    Glue.compose(manifest, options, function (err, server) {
        if (err) reject(err)
        resolve(server)
    })
}).then(function (server) {
    if (!module.parent) {
        server.start(function () {
            log.info('Server started at %s', server.info.uri)
        })
    }
    return server
}).catch(function (err) {
    log.error('Startup error', err)
    throw err
})
