/**
 * Created by pablo on 14.03.16.
 */
'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Path = require('path');
var pg = require('pg');
var conString = "postgres://hapi:mensajero@localhost/testhapi";


const server = new Hapi.Server();
server.connection({port: 3041});

server.route({
    method: 'GET',
    path: '/api/users',
    handler: function (request, reply) {
        var u = {name: 'qq'};
        reply(u);
    }
});
/*server.route({
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
 });*/
server.route({
    method: 'POST',
    path: '/auth/register',
    handler: regUser
});
function querySql(sql, params, callback) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            console.log('connection error', err);
            reply('connection error ' + err)
        }
        else {
            client.query(sql, params, function (err, result) {
                if (err) {
                    console.log(err);
                    callback('insert error ' + err);
                }
                else{
                    callback(null,result);
                }
                done();

            });

        }
    });

}

function execSql(sql, params, callback) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            console.log('connection error', err);
            reply('connection error ' + err)
        }
        else {
            client.query(sql, params, function (err, result) {
                var msg = 'OK';
                if (err) {
                    console.log(err);
                    msg = 'insert error ' + err;
                }
                done();
                callback(msg);
            });

        }
    });

}

function regUser(request, reply) {
    console.log(request.payload);
    var sql = 'INSERT INTO users (username, email, password, displayname) VALUES ($1,$2,$3,$4)';
    var params = [request.payload.username, request.payload.email, request.payload.password, request.payload.displayName];
    execSql(sql, params, (msg)=> {
        reply(msg);
    });
}

server.route({
    method: 'POST',
    path: '/auth/login',
    handler: function (request, reply) {
        console.log(request.payload);
        var sql = 'select * from users where username = $1';
        querySql(sql,[request.payload.username],(err,result)=>{
            if(err) {
                console.log(err);
                reply('ERROR');
            }
            else{
                if(result.rows.length == 0){
                    reply('user not found');
                }
                else{
                    var usr = result.rows[0];
                    console.log(usr);
                    if(request.payload.password == usr.password){
                        reply('OK');
                    }
                    else reply('Incorrect password');

                }
            }

        });
        //var cm = {username: request.payload.username, password: request.payload.password};
        //reply(cm);
    }
});

var staticConfig = {
    handler: {
        directory: {
            path: Path.join(__dirname, '/app'),
            index: true
        }
    }
};


server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }
    server.route({method: 'GET', path: '/{somethingss*}', config: staticConfig});

});
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});

//curl -X POST -H "Content-Type: application/json" -d '{ "username": "lksjkflksjf","password": "123456" }' -i http://comments.lobo-cano.ru/api/login