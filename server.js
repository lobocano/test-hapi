/**
 * Created by pablo on 14.03.16.
 */
'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Path = require('path');

const server = new Hapi.Server();
server.connection({ port: 3041 });
/*
server.route({
    method: 'GET',
    path: '/api/users',
    handler: function (request, reply) {
        var u = {name: 'qq'};
        reply(u);
    }
});
server.route({
    method: 'GET',
    path: '/api/comments',
    handler: function (request, reply) {
        var cm = {time: new Date()};
        reply(cm);
    }
});
server.route({
    method: 'GET',
    path: '/auth/login',
    handler: function (request, reply) {
        reply.file('./public/login.html');
    }
});
server.route({
    method: 'GET',
    path: '/auth/register',
    handler: function (request, reply) {
        reply.file('./public/register.html');
    }
});
server.route({
    method: 'POST',
    path: '/auth/login',
    handler: function (request, reply) {
        console.log(request.payload);
        var cm = {username: request.payload.username, password: request.payload.password};
        reply(cm);
    }
});
*/
var staticConfig = {handler: {
    directory: {
        path: Path.join(__dirname, '/app'),
        index: true
    }
}};


server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }
    server.route({method: 'GET',  path: '/{somethingss*}', config: staticConfig});

});
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});

//curl -X POST -H "Content-Type: application/json" -d '{ "username": "lksjkflksjf","password": "123456" }' -i http://comments.lobo-cano.ru/api/login